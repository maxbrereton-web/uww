import type React from 'react';
import { MousePointer2 } from 'lucide-react';
import { useStore } from '../../store';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const STEPS: string[] = [
  'Welcome to the UWW Event Calendar',
  'The calendar shows all upcoming events',
  'Tap an event to open it and see all the details',
  'The Event Info tab shows you dates, priority, competition type and any important documents',
  'The Event Schedule shows you the daily run of play',
  'The Event Team tab shows who is on the event and what roles they have',
  'The Posting Schedule is where all the social content is planned',
  'Availability & Flights — let the admin know when you are free and if your flights are booked',
  'Notifications keep you updated on what needs your attention',
  'The Comments tab is where you can message the admin team',
  'Tap the bell to see all your notifications',
  'Chat lets you message teammates directly or in groups',
  "That's everything — enjoy the UWW Event Calendar!",
];

const TARGETS: Array<{ left: string; top: string }> = [
  { left: '50%', top: '40%' },
  { left: '40%', top: '30%' },
  { left: '55%', top: '45%' },
  { left: '30%', top: '35%' },
  { left: '35%', top: '55%' },
  { left: '45%', top: '40%' },
  { left: '60%', top: '50%' },
  { left: '50%', top: '60%' },
  { left: '85%', top: '12%' },
  { left: '40%', top: '50%' },
  { left: '85%', top: '12%' },
  { left: '20%', top: '70%' },
  { left: '50%', top: '45%' },
];

export default function TutorialOverlay() {
  const step = useStore(s => s.tutorialStep);
  const next = useStore(s => s.nextTutorialStep);
  const close = useStore(s => s.closeTutorial);

  const idx = Math.min(step, STEPS.length - 1);
  const isLast = idx === STEPS.length - 1;
  const target = TARGETS[idx] || TARGETS[0];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.55)' }}>
      <div
        style={{
          position: 'absolute', left: target.left, top: target.top,
          transform: 'translate(-50%, -50%)', transition: 'left .6s ease, top .6s ease',
          color: '#fff', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.6))', pointerEvents: 'none',
        }}
      >
        <MousePointer2 size={40} fill="#fff" />
      </div>

      <div
        className="uww-overlay"
        style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 380, maxWidth: '90%', background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)', padding: 24,
        }}
      >
        <div style={{ ...condensed, fontSize: 10, color: 'var(--text-faint)', marginBottom: 10 }}>
          Step {idx + 1} / {STEPS.length}
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.45, color: 'var(--text)', fontWeight: 600, marginBottom: 22 }}>
          {STEPS[idx]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={close}
            style={{ ...condensed, fontSize: 11, padding: '6px 4px', cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
          >
            Skip
          </button>
          <button
            onClick={isLast ? close : next}
            style={{ ...condensed, fontSize: 12, padding: '9px 22px', cursor: 'pointer', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff' }}
          >
            {isLast ? 'Got it' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
