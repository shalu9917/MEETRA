import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  messages,
  currentUserId,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <aside
      className="glass-panel side-panel"
      style={{
        width: '340px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(14, 17, 29, 0.95)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        zIndex: 20
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '16px', color: '#ffffff' }}>Meeting Chat</h3>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={18} />
        </button>
      </div>

      {/* Message List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px'
          }}>
            <MessageSquare size={32} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
            <p>No messages yet.</p>
            <p style={{ fontSize: '12px', marginTop: '2px' }}>Send a message to everyone in the room.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === currentUserId;
            const timeStr = msg.timestamp
              ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  marginBottom: '4px',
                  fontSize: '12px'
                }}>
                  <span style={{ fontWeight: '600', color: isMe ? '#818cf8' : '#e2e8f0' }}>
                    {isMe ? 'You' : msg.userName}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                    {timeStr}
                  </span>
                </div>

                <div style={{
                  padding: '10px 14px',
                  borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isMe
                    ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  wordBreak: 'break-word',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          background: 'rgba(10, 12, 20, 0.6)'
        }}
      >
        <input
          id="input-chat-message"
          type="text"
          placeholder="Type message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            fontSize: '14px'
          }}
        />
        <button
          id="btn-chat-send"
          type="submit"
          disabled={!inputText.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            background: inputText.trim() ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            opacity: inputText.trim() ? 1 : 0.5
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </aside>
  );
};
