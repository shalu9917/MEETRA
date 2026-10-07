import React from 'react';
import { Mic, Sparkles, Monitor, Shield } from 'lucide-react';

export const HeroMeetingMockup: React.FC = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '460px',
      margin: '0 auto',
      perspective: '1000px'
    }}>
      {/* Glow Backdrop */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        right: '-15px',
        bottom: '-15px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 75%)',
        filter: 'blur(30px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Main Mockup Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(145deg, rgba(20, 25, 45, 0.9) 0%, rgba(10, 13, 26, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        padding: '16px',
        overflow: 'hidden'
      }}>
        {/* Mock Window Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <span style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              color: 'var(--accent-cyan)',
              background: 'rgba(6, 182, 212, 0.12)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: '700'
            }}>
              MTR-842-194
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              color: '#34d399',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              <span className="live-indicator" style={{ width: '6px', height: '6px' }} />
              <span>LIVE</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              00:24:18
            </span>
          </div>
        </div>

        {/* 2x2 Mock Video Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '12px'
        }}>
          {/* Tile 1: Active Speaker (Nitin) with Animated Waveform */}
          <div style={{
            position: 'relative',
            background: '#121629',
            borderRadius: '10px',
            aspectRatio: '16/11',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--accent-success)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}>
              NK
            </div>

            {/* Speaking Waveform Bars */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px',
              height: '14px'
            }}>
              <div className="waveform-bar" style={{ height: '6px' }} />
              <div className="waveform-bar" style={{ height: '14px' }} />
              <div className="waveform-bar" style={{ height: '10px' }} />
              <div className="waveform-bar" style={{ height: '12px' }} />
            </div>

            {/* Name tag */}
            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              right: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontWeight: '600',
              color: '#ffffff',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              <span>Nitin (Host)</span>
              <Mic size={10} color="#10b981" />
            </div>
          </div>

          {/* Tile 2: Khushboo */}
          <div style={{
            position: 'relative',
            background: '#121629',
            borderRadius: '10px',
            aspectRatio: '16/11',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '700'
            }}>
              KS
            </div>

            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              right: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontWeight: '600',
              color: '#ffffff',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              <span>Khushboo</span>
              <Mic size={10} color="#10b981" />
            </div>
          </div>

          {/* Tile 3: Screen Share Spotlight mini */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0d1224 0%, #151d38 100%)',
            borderRadius: '10px',
            aspectRatio: '16/11',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            overflow: 'hidden',
            padding: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              position: 'absolute',
              top: '6px',
              left: '6px',
              background: 'rgba(6, 182, 212, 0.2)',
              color: 'var(--accent-cyan)',
              fontSize: '9px',
              fontWeight: '700',
              padding: '2px 5px',
              borderRadius: '3px'
            }}>
              <Monitor size={10} />
              <span>SCREEN</span>
            </div>

            <div style={{
              width: '80%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginTop: '10px'
            }}>
              <div style={{ height: '4px', width: '90%', background: 'rgba(99, 102, 241, 0.4)', borderRadius: '2px' }} />
              <div style={{ height: '4px', width: '65%', background: 'rgba(6, 182, 212, 0.4)', borderRadius: '2px' }} />
              <div style={{ height: '4px', width: '80%', background: 'rgba(16, 185, 129, 0.4)', borderRadius: '2px' }} />
            </div>

            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              right: '6px',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              background: 'rgba(0, 0, 0, 0.65)',
              padding: '2px 6px',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              Sprint Roadmap.ts
            </div>
          </div>

          {/* Tile 4: Priyanshi */}
          <div style={{
            position: 'relative',
            background: '#121629',
            borderRadius: '10px',
            aspectRatio: '16/11',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '700'
            }}>
              PS
            </div>

            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              right: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontWeight: '600',
              color: '#ffffff',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              <span>Priyanshi</span>
              <Mic size={10} color="#10b981" />
            </div>
          </div>
        </div>

        {/* Floating Real-time Status Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <Shield size={13} color="#10b981" />
            <span>P2P Encrypted Mesh</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
            <Sparkles size={13} />
            <span>Ready for AI Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};
