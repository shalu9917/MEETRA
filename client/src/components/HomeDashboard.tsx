import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  LogIn, 
  Calendar, 
  Users, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Shield,
  Zap,
  Activity,
  Flame,
  ChevronRight
} from 'lucide-react';
import { getRecentMeetingsApi } from '../services/api';
import { QuotesCarousel } from './QuotesCarousel';
import { HeroMeetingMockup } from './HeroMeetingMockup';

interface HomeDashboardProps {
  onCreateClick: () => void;
  onJoinClick: (prefillCode?: string) => void;
  userName: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onCreateClick,
  onJoinClick,
  userName: _userName
}) => {
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [quickCode, setQuickCode] = useState('');
  const [quickCodeError, setQuickCodeError] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent');

  useEffect(() => {
    getRecentMeetingsApi()
      .then((meetings) => setRecentMeetings(meetings))
      .catch((err) => console.warn('Could not load recent meetings:', err));
  }, []);

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) {
      setQuickCodeError('Please enter a valid meeting ID');
      return;
    }
    setQuickCodeError('');
    onJoinClick(quickCode.trim());
  };

  // Mock upcoming meetings schedule for Phase 1 preview
  const upcomingMeetings = [
    {
      id: 'up-1',
      meetingCode: 'MTR-914-382',
      title: 'Weekly Leadership & Product Strategy Review',
      time: 'Today, 04:30 PM',
      participants: 6,
      tag: 'STRATEGY'
    },
    {
      id: 'up-2',
      meetingCode: 'MTR-703-491',
      title: 'AI Action Extraction Engine Sync (Phase 2 Prep)',
      time: 'Tomorrow, 11:00 AM',
      participants: 4,
      tag: 'TECH SYNC'
    }
  ];

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '36px 24px 60px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '36px',
      width: '100%'
    }}>
      {/* 1. HERO SECTION: 2-Column Responsive Layout */}
      <section style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 44px',
        background: 'linear-gradient(135deg, rgba(22, 28, 54, 0.75) 0%, rgba(12, 16, 32, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(24px)',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      }}>
        {/* Subtle Ambient Light Orbs */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '25%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '10%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Hero Column */}
          <div>
            {/* Top Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#c7d2fe',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.04em',
              marginBottom: '20px'
            }}>
              <span className="live-indicator" style={{ width: '6px', height: '6px' }} />
              <span>MEETRA OS 1.0</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
              <span style={{ color: 'var(--accent-cyan)' }}>NEXT-GEN VIDEO & AUDIO</span>
            </div>

            {/* Main Heading */}
            <h1 style={{
              fontSize: '48px',
              lineHeight: 1.12,
              marginBottom: '14px',
              background: 'linear-gradient(135deg, #ffffff 25%, #cbd5e1 65%, #a5b4fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.035em',
              fontWeight: '800'
            }}>
              Your Intelligent Meeting Companion
            </h1>

            {/* Tagline Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-cyan)',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(6, 182, 212, 0.25)'
            }}>
              <Flame size={14} color="var(--accent-cyan)" />
              <span>Meet. Decide. Act. Track.</span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              marginBottom: '32px',
              fontWeight: '400',
              lineHeight: 1.6,
              maxWidth: '560px'
            }}>
              Connect with ultra-low latency audio, crisp HD video, and real-time screen sharing. Engineered to transform spoken discussions into high-impact execution.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button
                id="btn-create-meeting-hero"
                onClick={onCreateClick}
                className="shimmer-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '16px',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.25s ease',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.5)';
                }}
              >
                <PlusCircle size={22} strokeWidth={2.5} />
                <span>+ Create Meeting</span>
              </button>

              <button
                id="btn-join-meeting-hero"
                onClick={() => onJoinClick()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 30px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '16px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                }}
              >
                <LogIn size={20} />
                <span>Join with Code</span>
              </button>
            </div>

            {/* Quick Micro-Stats Strip */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '13px',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} color="#10b981" />
                <span style={{ color: 'var(--text-secondary)' }}>End-to-End P2P</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="var(--accent-cyan)" />
                <span style={{ color: 'var(--text-secondary)' }}>Zero-Latency Mesh</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} color="#a855f7" />
                <span style={{ color: 'var(--text-secondary)' }}>Audio Activity Detection</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Live Meeting Mockup Showcase */}
          <div>
            <HeroMeetingMockup />
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC INSPIRING QUOTES CAROUSEL */}
      <QuotesCarousel />

      {/* 3. TWO ACTION CARDS: Instant Join & Phase 1 Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* Instant Join Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          background: 'linear-gradient(145deg, rgba(20, 26, 48, 0.7) 0%, rgba(12, 16, 30, 0.8) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              <LogIn size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '19px', color: '#ffffff', fontWeight: '700' }}>Instant Meeting Entry</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Got a code? Jump right into the lobby</p>
            </div>
          </div>

          <form onSubmit={handleQuickJoin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="input-quick-meeting-code"
                type="text"
                placeholder="MTR-XXX-XXX"
                value={quickCode}
                onChange={(e) => {
                  setQuickCode(e.target.value.toUpperCase());
                  setQuickCodeError('');
                }}
                style={{
                  flex: 1,
                  padding: '13px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: quickCodeError ? '1px solid var(--accent-danger)' : '1px solid var(--border-subtle)',
                  fontSize: '15px',
                  letterSpacing: '0.06em',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  color: '#ffffff'
                }}
              />
              <button
                type="submit"
                id="btn-quick-join-submit"
                style={{
                  padding: '13px 22px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0284c7 100%)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(6, 182, 212, 0.35)'
                }}
              >
                <span>Join</span>
                <ArrowRight size={16} />
              </button>
            </div>
            {quickCodeError && (
              <span style={{ fontSize: '12px', color: 'var(--accent-danger)' }}>{quickCodeError}</span>
            )}
          </form>
        </div>

        {/* Feature Highlights Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          background: 'linear-gradient(145deg, rgba(20, 26, 48, 0.7) 0%, rgba(12, 16, 30, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-success)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '19px', color: '#ffffff', fontWeight: '700' }}>Phase 1 Engine</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Robust real-time meeting primitives</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
              <span>Full P2P WebRTC</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
              <span>Screen Sharing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
              <span>Real-Time Group Chat</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
              <span>Speech Detection</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MEETINGS HUB: Tabs for Recent Meetings & Upcoming Schedule */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', color: '#ffffff', fontWeight: '700' }}>Meetings Hub</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Manage sessions, review previous minutes, or prepare for upcoming syncs
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setActiveTab('recent')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                background: activeTab === 'recent' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'recent' ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              Recent Sessions ({recentMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                background: activeTab === 'upcoming' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'upcoming' ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              Upcoming ({upcomingMeetings.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Recent Meetings */}
        {activeTab === 'recent' && (
          <div>
            {recentMeetings.length === 0 ? (
              <div className="glass-panel" style={{
                padding: '48px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <Calendar size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p style={{ fontSize: '16px', fontWeight: '500' }}>No recent meetings found</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Click "+ Create Meeting" to start your first session.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="glass-panel glow-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(145deg, rgba(20, 25, 46, 0.75) 0%, rgba(11, 14, 28, 0.85) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '800',
                          letterSpacing: '0.06em',
                          color: 'var(--accent-cyan)',
                          background: 'rgba(6, 182, 212, 0.12)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(6, 182, 212, 0.25)',
                          fontFamily: 'monospace'
                        }}>
                          {meeting.meetingCode}
                        </span>

                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: meeting.status === 'active' ? '#10b981' : 'var(--text-muted)',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: meeting.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}>
                          {meeting.status === 'active' && <span className="live-indicator" style={{ width: '6px', height: '6px' }} />}
                          {meeting.status || 'ended'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '10px', lineHeight: 1.35, fontWeight: '700' }}>
                        {meeting.title}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        <Clock size={14} />
                        <span>{new Date(meeting.createdAt || meeting.startedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Users size={15} color="var(--accent-primary)" />
                          {meeting.participantCount || 1} attendee{meeting.participantCount > 1 ? 's' : ''}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MessageSquare size={15} color="var(--accent-cyan)" />
                          {meeting.messageCount || 0} chats
                        </span>
                      </div>

                      <button
                        onClick={() => onJoinClick(meeting.meetingCode)}
                        style={{
                          padding: '9px 18px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                          color: '#c7d2fe',
                          fontSize: '13px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--accent-primary)';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)';
                          e.currentTarget.style.color = '#c7d2fe';
                        }}
                      >
                        <span>Rejoin Room</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upcoming Meetings Schedule */}
        {activeTab === 'upcoming' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {upcomingMeetings.map((item) => (
              <div
                key={item.id}
                className="glass-panel glow-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(145deg, rgba(20, 25, 46, 0.75) 0%, rgba(11, 14, 28, 0.85) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.06em',
                      color: '#a78bfa',
                      background: 'rgba(167, 139, 250, 0.15)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(167, 139, 250, 0.3)'
                    }}>
                      {item.tag}
                    </span>

                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'monospace'
                    }}>
                      {item.meetingCode}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '10px', lineHeight: 1.35, fontWeight: '700' }}>
                    {item.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '13px', fontWeight: '500' }}>
                    <Calendar size={14} />
                    <span>{item.time}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Users size={15} color="var(--accent-primary)" />
                    <span>{item.participants} registered</span>
                  </div>

                  <button
                    onClick={() => onJoinClick(item.meetingCode)}
                    style={{
                      padding: '9px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                  >
                    <span>Start Session</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
