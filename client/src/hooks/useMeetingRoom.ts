import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Participant, ChatMessage } from '../types';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

interface UseMeetingRoomProps {
  meetingCode: string;
  userId: string;
  userName: string;
  isHost: boolean;
  initialMicOn: boolean;
  initialCameraOn: boolean;
  onMeetingEnded: (reason?: string) => void;
}

export function useMeetingRoom({
  meetingCode,
  userId,
  userName,
  isHost,
  initialMicOn,
  initialCameraOn,
  onMeetingEnded
}: UseMeetingRoomProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(initialMicOn);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(initialCameraOn);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState<boolean>(false);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Setup Audio Activity Analyser for speaking indicator
  const setupAudioAnalyser = useCallback((stream: MediaStream) => {
    try {
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const speaking = average > 14 && isMicOn;
        setIsLocalSpeaking(speaking);

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (e) {
      console.warn('Web Audio API not supported or audio analysis failed:', e);
    }
  }, [isMicOn]);

  // Create Peer Connection helper
  const createPeerConnection = useCallback((targetSocketId: string) => {
    if (peerConnections.current.has(targetSocketId)) {
      return peerConnections.current.get(targetSocketId)!;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current.set(targetSocketId, pc);

    // Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('signal-ice-candidate', {
          targetSocketId,
          candidate: event.candidate
        });
      }
    };

    // Remote Track received
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.socketId === targetSocketId) {
            return { ...p, stream: remoteStream };
          }
          return p;
        })
      );
    };

    return pc;
  }, []);

  // Initialize Local Media & Socket
  useEffect(() => {
    let isMounted = true;

    async function initRoom() {
      try {
        // Request user media
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
        } catch (mediaErr) {
          console.warn('Could not access both video & audio, trying audio only or dummy stream:', mediaErr);
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          } catch {
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(0, 0, 640, 480);
            }
            const videoStream = canvas.captureStream(25);
            stream = videoStream;
          }
        }

        if (!isMounted) return;

        // Apply initial state
        stream.getAudioTracks().forEach((t) => (t.enabled = initialMicOn));
        stream.getVideoTracks().forEach((t) => (t.enabled = initialCameraOn));

        localStreamRef.current = stream;
        setLocalStream(stream);
        setupAudioAnalyser(stream);

        // Connect Socket.IO
        const socket = io('/', {
          transports: ['websocket', 'polling']
        });
        socketRef.current = socket;

        socket.on('connect', () => {
          setConnectionStatus('connected');
          socket.emit('join-room', {
            meetingCode,
            userId,
            userName,
            micOn: initialMicOn,
            cameraOn: initialCameraOn,
            isHost
          });
        });

        // Received room participants list on joining
        socket.on('room-joined', async ({ participants: existingPeers }) => {
          const peersList: Participant[] = existingPeers.map((p: any) => ({
            id: p.userId,
            name: p.userName,
            socketId: p.socketId,
            micOn: p.micOn,
            cameraOn: p.cameraOn,
            isScreenSharing: p.isScreenSharing || false,
            isHost: p.isHost,
            stream: null
          }));

          setParticipants(peersList);

          // Initiate WebRTC offers to all existing peers
          for (const peer of existingPeers) {
            const pc = createPeerConnection(peer.socketId);
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit('signal-offer', {
                targetSocketId: peer.socketId,
                offer
              });
            } catch (err) {
              console.error('Error creating offer to peer:', peer.socketId, err);
            }
          }
        });

        // New participant joined the room
        socket.on('user-joined', (newPeer: any) => {
          setParticipants((prev) => {
            if (prev.some((p) => p.socketId === newPeer.socketId)) return prev;
            return [
              ...prev,
              {
                id: newPeer.userId,
                name: newPeer.userName,
                socketId: newPeer.socketId,
                micOn: newPeer.micOn,
                cameraOn: newPeer.cameraOn,
                isScreenSharing: false,
                isHost: newPeer.isHost,
                stream: null
              }
            ];
          });
        });

        // Received WebRTC Offer from a newcomer
        socket.on('signal-offer', async ({ senderSocketId, offer }) => {
          const pc = createPeerConnection(senderSocketId);
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('signal-answer', {
              targetSocketId: senderSocketId,
              answer
            });
          } catch (err) {
            console.error('Error handling offer from peer:', senderSocketId, err);
          }
        });

        // Received WebRTC Answer
        socket.on('signal-answer', async ({ senderSocketId, answer }) => {
          const pc = peerConnections.current.get(senderSocketId);
          if (pc) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (err) {
              console.error('Error setting remote description from answer:', err);
            }
          }
        });

        // Received ICE candidate
        socket.on('signal-ice-candidate', async ({ senderSocketId, candidate }) => {
          const pc = peerConnections.current.get(senderSocketId);
          if (pc && candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.error('Error adding ICE candidate:', err);
            }
          }
        });

        // Peer updated mic/camera/screen state
        socket.on('media-state-updated', ({ socketId, micOn, cameraOn, isScreenSharing: remoteScreenShare }) => {
          setParticipants((prev) =>
            prev.map((p) => {
              if (p.socketId === socketId) {
                return {
                  ...p,
                  micOn: typeof micOn === 'boolean' ? micOn : p.micOn,
                  cameraOn: typeof cameraOn === 'boolean' ? cameraOn : p.cameraOn,
                  isScreenSharing: typeof remoteScreenShare === 'boolean' ? remoteScreenShare : p.isScreenSharing
                };
              }
              return p;
            })
          );
        });

        // Peer left room
        socket.on('user-left', ({ socketId }) => {
          const pc = peerConnections.current.get(socketId);
          if (pc) {
            pc.close();
            peerConnections.current.delete(socketId);
          }
          setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
        });

        // Host ended the meeting
        socket.on('meeting-ended', ({ reason }) => {
          onMeetingEnded(reason || 'Meeting ended by the host');
        });

        // Chat history
        socket.on('chat-history', (history: ChatMessage[]) => {
          setMessages(history);
        });

        // New chat message
        socket.on('receive-message', (msg: ChatMessage) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (err) {
        console.error('Room init failed:', err);
      }
    }

    initRoom();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [meetingCode, userId, userName, isHost, createPeerConnection, setupAudioAnalyser, onMeetingEnded]);

  // Toggle Microphone
  const toggleMicrophone = useCallback(() => {
    if (localStreamRef.current) {
      const nextState = !isMicOn;
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = nextState;
      });
      setIsMicOn(nextState);

      if (socketRef.current) {
        socketRef.current.emit('media-state-change', {
          meetingCode,
          micOn: nextState
        });
      }
    }
  }, [isMicOn, meetingCode]);

  // Toggle Camera
  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const nextState = !isCameraOn;
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = nextState;
      });
      setIsCameraOn(nextState);

      if (socketRef.current) {
        socketRef.current.emit('media-state-change', {
          meetingCode,
          cameraOn: nextState
        });
      }
    }
  }, [isCameraOn, meetingCode]);

  // Toggle Screen Sharing
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);

      if (localStreamRef.current) {
        const cameraTrack = localStreamRef.current.getVideoTracks()[0];
        if (cameraTrack) {
          peerConnections.current.forEach((pc) => {
            const senders = pc.getSenders();
            const sender = senders.find((s) => s.track && s.track.kind === 'video');
            if (sender) {
              sender.replaceTrack(cameraTrack);
            }
          });
        }
      }

      if (socketRef.current) {
        socketRef.current.emit('media-state-change', {
          meetingCode,
          isScreenSharing: false
        });
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        setScreenStream(stream);
        setIsScreenSharing(true);

        const screenTrack = stream.getVideoTracks()[0];

        peerConnections.current.forEach((pc) => {
          const senders = pc.getSenders();
          const sender = senders.find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        if (socketRef.current) {
          socketRef.current.emit('media-state-change', {
            meetingCode,
            isScreenSharing: true
          });
        }

        screenTrack.onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0];
            if (cameraTrack) {
              peerConnections.current.forEach((pc) => {
                const senders = pc.getSenders();
                const sender = senders.find((s) => s.track && s.track.kind === 'video');
                if (sender) {
                  sender.replaceTrack(cameraTrack);
                }
              });
            }
          }
          if (socketRef.current) {
            socketRef.current.emit('media-state-change', {
              meetingCode,
              isScreenSharing: false
            });
          }
        };
      } catch (err) {
        console.warn('Screen sharing cancelled or not supported:', err);
      }
    }
  }, [isScreenSharing, screenStream, meetingCode]);

  // Send Chat Message
  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit('send-message', {
      meetingCode,
      messageText: text
    });
  }, [meetingCode]);

  // Leave Meeting
  const leaveMeeting = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave-meeting', { meetingCode });
    }
  }, [meetingCode]);

  // End Meeting for Everyone
  const endMeetingForEveryone = useCallback(() => {
    if (socketRef.current && isHost) {
      socketRef.current.emit('end-meeting', { meetingCode });
    }
  }, [meetingCode, isHost]);

  return {
    localStream,
    screenStream,
    isMicOn,
    isCameraOn,
    isScreenSharing,
    isLocalSpeaking,
    participants,
    messages,
    connectionStatus,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    sendMessage,
    leaveMeeting,
    endMeetingForEveryone
  };
}
