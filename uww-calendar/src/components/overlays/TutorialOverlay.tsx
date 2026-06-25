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

  // Ring sits on the current target; the cursor keeps its own persistent position
  // so it can glide from one step to the next instead of disappearing between them.
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [pos, setPos] = useState(() => ({
    x: (typeof window !== 'undefined' ? window.innerWidth : 800) / 2,
    y: (typeof window !== 'undefined' ? window.innerHeight : 600) * 0.42,
  }));
  const [cursorVisible, setCursorVisible] = useState(false);
  const [ringVisible, setRingVisible] = useState(false);

  useEffect(() => {
    const s = steps[idx];
    s.setup?.();
    // Re-measure once the app has navigated/rendered. We keep the previous rect and
    // cursor position in place during the wait, so both glide smoothly to the new spot.
    const measure = setTimeout(() => {
      const el = s.tut ? document.querySelector(`[data-tut="${s.tut}"]`) : null;
      if (el) {
        const r = el.getBoundingClientRect();
        setRect(r);
        setPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        setCursorVisible(true);
        setRingVisible(true);
      } else {
        // No target on this step: gently fade the cursor + ring out where they are.
        setCursorVisible(false);
        setRingVisible(false);
      }
    }, 460);
    return () => clearTimeout(measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const glide = 'left .65s cubic-bezier(.45,.05,.2,1), top .65s cubic-bezier(.45,.05,.2,1)';

  // The text box stays centred for every step; only the cursor + ring move.
  const boxStyle: React.CSSProperties = {
    position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
    width: BOX_W, maxWidth: 'calc(100vw - 32px)',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.45)' }}>
      {/* Highlight ring on the target — kept mounted so it can glide + fade */}
      {rect && (
        <div
          style={{
            position: 'fixed', left: rect.left - 5, top: rect.top - 5, width: rect.width + 10, height: rect.height + 10,
            border: '2px solid var(--accent)', borderRadius: 10, boxShadow: '0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent)',
            pointerEvents: 'none', zIndex: 201, opacity: ringVisible ? 1 : 0,
            transition: `${glide}, width .65s cubic-bezier(.45,.05,.2,1), height .65s cubic-bezier(.45,.05,.2,1), opacity .4s ease`,
          }}
        />
      )}

      {/* Animated cursor — always mounted so it travels point to point */}
      <div
        style={{
          position: 'fixed', left: pos.x, top: pos.y, zIndex: 202, color: '#fff',
          transition: `${glide}, opacity .4s ease`, opacity: cursorVisible ? 1 : 0,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.7))', pointerEvents: 'none', willChange: 'left, top',
        }}
      >
        <MousePointer2 size={36} fill="#fff" />
      </div>

      {/* Text box */}
      <div
        className="uww-overlay"
        style={{
          ...boxStyle, zIndex: 203, background: 'var(--panel)', border: '1px solid var(--border-strong)',
          borderRadius: 14, boxShadow: 'var(--shadow)', padding: 22,
        }}
      >
        {/* key re-triggers the fade on each step. position/zIndex keeps it from
            painting over the buttons while its opacity animation runs. */}
        <div key={idx} style={{ animation: 'uwwFade .4s ease', position: 'relative', zIndex: 0 }}>
          <div style={{ ...condensed, fontSize: 10, color: 'var(--text-faint)', marginBottom: 10 }}>
            Step {idx + 1} / {steps.length}
          </div>
          <div style={{ fontSize: 15.5, lineHeight: 1.5, color: 'var(--text)', fontWeight: 600, marginBottom: 20 }}>
            {cur.text}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
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
