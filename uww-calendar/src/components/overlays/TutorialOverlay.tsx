import type React from 'react';
import { useEffect, useState } from 'react';
import { MousePointer2 } from 'lucide-react';
import { useStore } from '../../store';
import type { NotifTab } from '../../types';

const condensed: React.CSSProperties = {
  fontStretch: '75%', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em',
};

const TUT_EVENT = 'ev1';
const BOX_W = 360;
const BOX_H = 168;

interface Step {
  text: string;
  tut?: string;            // data-tut target to point at (omit = centered, no cursor)
  setup?: () => void;      // navigate the app so the target is on screen
}

export default function TutorialOverlay() {
  const step = useStore(s => s.tutorialStep);
  const next = useStore(s => s.nextTutorialStep);
  const close = useStore(s => s.closeTutorial);
  const selectEvent = useStore(s => s.selectEvent);
  const setPage = useStore(s => s.setPage);
  const setCalView = useStore(s => s.setCalView);

  const goCalendar = () => { selectEvent(null); setPage('calendar'); setCalView('calendar'); };
  const openEvent = (tab: NotifTab) => { setPage('calendar'); selectEvent(TUT_EVENT, tab); };

  const steps: Step[] = [
    { text: 'Welcome — here is a quick tour of your UWW Event Calendar.', setup: goCalendar },
    { text: 'This is your calendar. Every event you are on shows up here, colour coded with a priority dot and the staff who are approved.', setup: goCalendar },
    { text: 'Tap any event to open it and see all of its details.', tut: 'cal-event', setup: goCalendar },
    { text: 'Event Info shows the dates, priority, competition and any important documents.', tut: 'tab-info', setup: () => openEvent('info') },
    { text: 'Event Schedule lays out the daily run of play.', tut: 'tab-schedule', setup: () => openEvent('schedule') },
    { text: 'Event Team shows who is on the event and the roles they have. Your icon appears here once you are approved.', tut: 'tab-staffRoles', setup: () => openEvent('staffRoles') },
    { text: 'Posting Schedule is where all of the social content is planned, day by day.', tut: 'tab-posting', setup: () => openEvent('posting') },
    { text: 'Availability and Flights is where you tell the admin when you are free and whether your flights are booked.', tut: 'tab-flights', setup: () => openEvent('flights') },
    { text: 'Notifications for this event tell you exactly what needs your attention.', tut: 'tab-notifications', setup: () => openEvent('notifications') },
    { text: 'Comments is where you can message the admin team about the event.', tut: 'tab-requests', setup: () => openEvent('requests') },
    { text: 'Tap the bell at the top any time to see all of your notifications in one place.', tut: 'bell', setup: goCalendar },
    { text: 'Chat lets you message teammates directly or in groups.', tut: 'nav-chat', setup: goCalendar },
    { text: "That's everything — enjoy the UWW Event Calendar!", setup: goCalendar },
  ];

  const idx = Math.min(step, steps.length - 1);
  const isLast = idx === steps.length - 1;
  const cur = steps[idx];

  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const s = steps[idx];
    s.setup?.();
    // Clear the old target, then re-measure once the app has navigated/rendered.
    const clear = setTimeout(() => setRect(null), 0);
    const measure = setTimeout(() => {
      const el = s.tut ? document.querySelector(`[data-tut="${s.tut}"]`) : null;
      setRect(el ? el.getBoundingClientRect() : null);
    }, 440);
    return () => { clearTimeout(clear); clearTimeout(measure); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Cursor tip sits at the centre of the target.
  const cursorX = rect ? rect.left + rect.width / 2 : 0;
  const cursorY = rect ? rect.top + rect.height / 2 : 0;

  // Place the text box near the target without covering it; else centre it.
  let boxStyle: React.CSSProperties;
  if (rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const below = rect.bottom + BOX_H + 20 < vh;
    const top = below ? rect.bottom + 18 : Math.max(16, rect.top - BOX_H - 18);
    const left = Math.min(Math.max(rect.left + rect.width / 2 - BOX_W / 2, 16), vw - BOX_W - 16);
    boxStyle = { position: 'fixed', left, top, width: BOX_W, maxWidth: 'calc(100vw - 32px)' };
  } else {
    boxStyle = { position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: BOX_W, maxWidth: 'calc(100vw - 32px)' };
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.45)' }}>
      {/* Highlight ring on the target */}
      {rect && (
        <div
          style={{
            position: 'fixed', left: rect.left - 5, top: rect.top - 5, width: rect.width + 10, height: rect.height + 10,
            border: '2px solid var(--accent)', borderRadius: 10, boxShadow: '0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent)',
            pointerEvents: 'none', transition: 'all .45s ease', zIndex: 201,
          }}
        />
      )}

      {/* Animated cursor */}
      {rect && (
        <div
          style={{
            position: 'fixed', left: cursorX, top: cursorY, zIndex: 202,
            transition: 'left .5s ease, top .5s ease', color: '#fff',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.7))', pointerEvents: 'none',
          }}
        >
          <MousePointer2 size={38} fill="#fff" />
        </div>
      )}

      {/* Text box */}
      <div
        className="uww-overlay"
        style={{
          ...boxStyle, zIndex: 203, background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22,
        }}
      >
        <div style={{ ...condensed, fontSize: 10, color: 'var(--text-faint)', marginBottom: 10 }}>
          Step {idx + 1} / {steps.length}
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 1.5, color: 'var(--text)', fontWeight: 600, marginBottom: 20 }}>
          {cur.text}
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
            style={{ ...condensed, fontSize: 12, padding: '10px 24px', cursor: 'pointer', borderRadius: 9, border: 'none', background: 'var(--accent-deep)', color: '#fff' }}
          >
            {isLast ? 'Got it' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
