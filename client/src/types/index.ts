export interface Participant {
  id: string;
  name: string;
  socketId: string;
  micOn: boolean;
  cameraOn: boolean;
  isScreenSharing: boolean;
  isHost?: boolean;
  isLocal?: boolean;
  stream?: MediaStream | null;
  isSpeaking?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

export interface MeetingDetails {
  id: string;
  meetingCode: string;
  title: string;
  hostId: string;
  hostName?: string;
  createdAt?: string;
  startedAt?: string;
  status?: string;
}

export interface MeetingSummaryData {
  meetingCode: string;
  title: string;
  hostName?: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  durationSeconds: number;
  participantCount: number;
  messageCount: number;
}

export type AppScreen = 'home' | 'create' | 'join' | 'lobby' | 'meeting' | 'end';
