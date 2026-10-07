import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Users, MessageSquare, CheckCircle, BrainCircuit } from 'lucide-react';
import { getMeetingSummaryApi } from '../services/api';
import type { MeetingSummaryData } from '../types';

interface MeetingEndScreenProps {
  meetingCode: string;
  meetingTitle: string;
  onBackToDashboard: () => void;
}

export const MeetingEndScreen: React.FC<MeetingEndScreenProps> = ({
  meetingCode,
  meetingTitle,
  onBackToDashboard
}) => {
  const [summary, setSummary] = useState<MeetingSummaryData | null>(null);

  useEffect(() => {
    getMeetingSummaryApi(meetingCode)
      .then((data) => setSummary(data))
      .catch((err) => {
        console.warn('Could not load summary:', err);
      });
  }, [meetingCode]);

  return (
    <div style={{
      maxWidth: '720px',
      margin: '40px auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      <div className="glass-panel" style={{
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--accent-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle size={36} />
        </div>

        <h1 style={{
          fontSize: '32px',
          color: '#ffffff',
          marginBottom: '8px'
        }}>
          Meeting Ended
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--accent-cyan)',
          fontWeight: '600',
          marginBottom: '32px'
        }}>
          {meetingTitle || summary?.title || 'Meeting Session'}
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '36px'
        }}>
          {/* Duration */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 14px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px auto'
            }}>
              <Clock size={18} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Duration
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
              {summary ? `${summary.durationMinutes} min` : '1 min'}
            </div>
          </div>

          {/* Participants */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 14px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px auto'
            }}>
              <Users size={18} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Participants
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
              {summary ? summary.participantCount : 1}
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 14px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px auto'
            }}>
              <MessageSquare size={18} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Messages
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
              {summary ? summary.messageCount : 0}
            </div>
          </div>
        </div>

        {/* AI Meeting Intelligence Phase 2 Placeholder Banner */}
        <div style={{
          position: 'relative',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          textAlign: 'left',
          marginBottom: '32px',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <BrainCircuit size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                  AI Meeting Intelligence
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#a5b4fc',
                  background: 'rgba(99, 102, 241, 0.25)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Coming in Phase 2
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                In Phase 2, MEETRA will automatically analyze this session to generate executive summary minutes of meeting (MOM), extract decisions, detect action items, and assign owners with deadlines.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Action Insight Quote */}
        <div style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '28px',
          fontSize: '13px',
          fontStyle: 'italic',
          color: '#cbd5e1',
          lineHeight: 1.5
        }}>
          💡 "The true measure of a meeting isn't how well it went, but how swiftly the agreed actions are delivered."
        </div>

        {/* Back to Dashboard Button */}
        <button
          id="btn-back-dashboard-end"
          onClick={onBackToDashboard}
          style={{
            padding: '14px 28px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
