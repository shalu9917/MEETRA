import React, { useEffect, useState } from 'react';
import { X, Mic, Video, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    if (isOpen && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
        setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
      }).catch(console.warn);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '28px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            color: 'var(--text-muted)',
            padding: '8px',
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '20px', color: '#ffffff', marginBottom: '20px' }}>
          Device & Audio Settings
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Microphone */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Mic size={16} /> Microphone
            </label>
            <select style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#0d101d',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '14px'
            }}>
              {audioDevices.length > 0 ? (
                audioDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Microphone ${i + 1}`}
                  </option>
                ))
              ) : (
                <option>Default System Microphone</option>
              )}
            </select>
          </div>

          {/* Camera */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Video size={16} /> Camera
            </label>
            <select style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#0d101d',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '14px'
            }}>
              {videoDevices.length > 0 ? (
                videoDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))
              ) : (
                <option>Default Integrated Webcam</option>
              )}
            </select>
          </div>

          {/* Security & Info */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            fontSize: '12px',
            color: '#a5b4fc',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Shield size={16} style={{ flexShrink: 0 }} />
            <span>Audio & Video streams are routed directly peer-to-peer via encrypted WebRTC.</span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              marginTop: '8px'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
