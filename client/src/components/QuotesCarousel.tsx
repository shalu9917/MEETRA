import React, { useState, useEffect, useCallback } from 'react';
import { Quote, ChevronRight, ChevronLeft, Copy, Check, Star } from 'lucide-react';

interface QuoteItem {
  id: number;
  text: string;
  author: string;
  role?: string;
  category: 'ACTION' | 'PRODUCTIVITY' | 'LEADERSHIP' | 'COLLABORATION' | 'INNOVATION' | 'FOCUS';
  context: string;
}

const MEETRA_QUOTES: QuoteItem[] = [
  {
    id: 1,
    text: "Meetings should be where decisions are made, not where work goes to die.",
    author: "Modern Leadership Axiom",
    category: "PRODUCTIVITY",
    context: "MEETRA Core Philosophy"
  },
  {
    id: 2,
    text: "Meet. Decide. Act. Track. Execution is the only bridge between talking about ideas and actually shipping them.",
    author: "MEETRA Ethos",
    category: "ACTION",
    context: "Foundational Creed"
  },
  {
    id: 3,
    text: "Without a clear owner and a hard deadline, a decision is just a beautifully worded wish.",
    author: "Agile Principle",
    category: "ACTION",
    context: "Accountability"
  },
  {
    id: 4,
    text: "Don't count the meetings you attend. Make every single meeting count for the entire team.",
    author: "Executive Wisdom",
    category: "LEADERSHIP",
    context: "Team Efficiency"
  },
  {
    id: 5,
    text: "Coming together is a beginning, keeping together is progress, working together is success.",
    author: "Henry Ford",
    category: "COLLABORATION",
    context: "Synergy & Alignment"
  },
  {
    id: 6,
    text: "The secret to extraordinary team velocity is short, decisive meetings followed by relentless execution.",
    author: "Silicon Valley Playbook",
    category: "PRODUCTIVITY",
    context: "Team Velocity"
  },
  {
    id: 7,
    text: "Innovation is not born in a meeting room. But the best innovations are refined, aligned, and shipped in one.",
    author: "Product Leadership Principle",
    category: "INNOVATION",
    context: "Creative Alignment"
  },
  {
    id: 8,
    text: "If a meeting doesn't end with a list of owners, deadlines, and action items — it was just a conversation.",
    author: "MEETRA Design Principle",
    category: "ACTION",
    context: "Execution Mindset"
  },
  {
    id: 9,
    text: "The quality of your team's output is directly proportional to the quality of your communication.",
    author: "Systems Thinking Framework",
    category: "COLLABORATION",
    context: "Communication Excellence"
  },
  {
    id: 10,
    text: "Eliminate the unnecessary meeting and you double the productivity. Keep the ones that decide.",
    author: "Jeff Bezos (adapted)",
    author2: "Jeff Bezos",
    role: "Amazon Founder",
    category: "FOCUS",
    context: "Focus & Efficiency"
  },
  {
    id: 11,
    text: "Leadership is not about being the loudest voice in the room, but knowing when to call the room to order.",
    author: "Modern Leadership Framework",
    category: "LEADERSHIP",
    context: "Decisive Leadership"
  },
  {
    id: 12,
    text: "The best meeting is one where everyone leaves knowing exactly what to do next.",
    author: "Agile & Scrum Wisdom",
    category: "PRODUCTIVITY",
    context: "Clarity & Execution"
  }
];

const CATEGORY_CONFIG = {
  ACTION: { color: '#f59e0b', label: '⚡ Action', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' },
  PRODUCTIVITY: { color: '#06b6d4', label: '🚀 Productivity', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)' },
  LEADERSHIP: { color: '#8b5cf6', label: '👑 Leadership', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)' },
  COLLABORATION: { color: '#10b981', label: '🤝 Collaboration', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' },
  INNOVATION: { color: '#f472b6', label: '💡 Innovation', bg: 'rgba(244, 114, 182, 0.1)', border: 'rgba(244, 114, 182, 0.3)' },
  FOCUS: { color: '#fb923c', label: '🎯 Focus', bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.3)' },
};

export const QuotesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [starred, setStarred] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const INTERVAL_MS = 8000;

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MEETRA_QUOTES.length);
      setFadeIn(true);
      setProgress(0);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  }, [isAnimating]);

  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + MEETRA_QUOTES.length) % MEETRA_QUOTES.length);
      setFadeIn(true);
      setProgress(0);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  }, [isAnimating]);

  const goToIndex = useCallback((idx: number) => {
    if (idx === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex(idx);
      setFadeIn(true);
      setProgress(0);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  }, [currentIndex, isAnimating]);

  // Auto-cycle
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

  // Progress bar
  useEffect(() => {
    if (isPaused) return;
    setProgress(0);
    const startTime = Date.now();
    const rafId = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / INTERVAL_MS) * 100, 100));
      if (elapsed < INTERVAL_MS) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(rafId);
  }, [currentIndex, isPaused]);

  const currentQuote = MEETRA_QUOTES[currentIndex];
  const catConfig = CATEGORY_CONFIG[currentQuote.category];

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStar = (id: number) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="glass-panel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(18, 22, 44, 0.85) 0%, rgba(11, 14, 28, 0.92) 100%)',
        border: `1px solid ${catConfig.border}`,
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`,
        overflow: 'hidden',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease'
      }}
    >
      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '2px',
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${catConfig.color}aa, ${catConfig.color})`,
        transition: 'width 0.1s linear',
        boxShadow: `0 0 8px ${catConfig.color}80`,
        zIndex: 10
      }} />

      {/* Background glow accent */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${catConfig.color}18 0%, transparent 65%)`,
        pointerEvents: 'none',
        transition: 'background 0.6s ease'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '-40px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${catConfig.color}0d 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ padding: '28px 32px', position: 'relative', zIndex: 2 }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quote icon */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: `${catConfig.bg}`,
              border: `1px solid ${catConfig.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: catConfig.color,
              flexShrink: 0
            }}>
              <Quote size={18} />
            </div>

            {/* Category badge */}
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.06em',
              color: catConfig.color,
              background: catConfig.bg,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${catConfig.border}`,
              transition: 'all 0.4s ease'
            }}>
              {catConfig.label}
            </span>

            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontStyle: 'italic'
            }}>
              {currentQuote.context}
            </span>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Star */}
            <button
              onClick={() => toggleStar(currentQuote.id)}
              title={starred.has(currentQuote.id) ? 'Unstar' : 'Star this quote'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: starred.has(currentQuote.id) ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.05)',
                border: starred.has(currentQuote.id) ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid var(--border-subtle)',
                color: starred.has(currentQuote.id) ? '#fbbf24' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Star size={14} fill={starred.has(currentQuote.id) ? '#fbbf24' : 'none'} />
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              title="Copy quote"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: copied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                color: copied ? '#34d399' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Navigation arrows */}
            <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
              <button
                onClick={goToPrev}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={goToNext}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Opening decorative large quote mark */}
        <div style={{
          fontSize: '80px',
          lineHeight: '0.6',
          color: catConfig.color,
          opacity: 0.15,
          fontFamily: 'Georgia, serif',
          marginBottom: '8px',
          userSelect: 'none',
          transition: 'color 0.5s ease'
        }}>
          "
        </div>

        {/* Quote Body with Smooth Crossfade */}
        <div style={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.99)',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <p style={{
            fontSize: '19px',
            fontWeight: '500',
            color: '#f8fafc',
            lineHeight: '1.6',
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            margin: 0
          }}>
            {currentQuote.text}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '2px',
              background: `linear-gradient(90deg, ${catConfig.color}, transparent)`,
              borderRadius: '1px'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: catConfig.color,
              transition: 'color 0.5s ease'
            }}>
              — {currentQuote.author}
            </span>
            {currentQuote.role && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                · {currentQuote.role}
              </span>
            )}
          </div>
        </div>

        {/* Bottom: Slide Indicators + Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid rgba(255,255,255,0.06)`
        }}>
          {/* Dot indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {MEETRA_QUOTES.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => goToIndex(idx)}
                title={`Quote ${idx + 1}`}
                style={{
                  width: idx === currentIndex ? '20px' : '5px',
                  height: '5px',
                  borderRadius: '3px',
                  background: idx === currentIndex ? catConfig.color : 'rgba(255, 255, 255, 0.18)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: idx === currentIndex ? `0 0 6px ${catConfig.color}80` : 'none'
                }}
              />
            ))}
          </div>

          {/* Counter + pause hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isPaused && (
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                PAUSED
              </span>
            )}
            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.04em'
            }}>
              {currentIndex + 1} / {MEETRA_QUOTES.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
