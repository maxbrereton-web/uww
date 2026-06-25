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
  prepare?: () => void;    // make the target measurable (runs at step start, before the glide)
  arrive?: () => void;     // open the relevant screen/tab (runs once the cursor reaches the target)
}

export default function TutorialOverlay() {
  const step = useStore(s => s.tutorialStep);
  const next = useStore(s => s.nextTutorialStep);
  const close = useStore(s => s.closeTutorial);
  const selectEvent = useStore(s => s.selectEvent);
  const setPage = useStore(s => s.setPage);
  const setCalView = useStore(s => s.setCalView);
  const setEventTab = useStore(s => s.setEventTab);

  const goCalendar = () => { selectEvent(null); setPage('calendar'); setCalView('calendar'); };
  // Make sure the event is open (so its tab bar is measurable) WITHOUT switching to the
  // step's tab — that happens on arrival so the screen opens only when the cursor lands.
  const ensureEventOpen = () => {
    if (useStore.getState().selectedEventId !== TUT_EVENT) { setPage('calendar'); selectEvent(TUT_EVENT, 'info'); }
  };
  const onTab = (tab: NotifTab): Step => ({
    text: '', tut: `tab-${tab}`, prepare: ensureEventOpen, arrive: () => setEventTab(tab),
  });

  const steps: Step[] = [
    { text: 'Welcome — here is a quick tour of your UWW Event Calendar.', prepare: goCalendar },
    { text: 'This is your calendar. Every event you are on shows up here, colour coded with a priority dot and the staff who are approved.', prepare: goCalendar },
    { text: 'Tap any event to open it and see all of its details.', tut: 'cal-event', prepare: goCalendar },
    { ...onTab('info'), text: 'Event Info shows the dates, priority, competition and any important documents.' },
    { ...onTab('schedule'), text: 'Event Schedule lays out the daily run of play.' },
    { ...onTab('posting'), text: 'Posting Schedule is where all of the social content is planned, day by day.' },
    { ...onTab('staffRoles'), text: 'Event Team shows who is on the event and the roles they have. Your icon appears here once you are approved.' },
    { ...onTab('flights'), text: 'Availability and Flights is where you tell the admin when you are free and whether your flights are booked.' },
    { ...onTab('notifications'), text: 'Notifications for this event tell you exactly what needs your attention.' },
    { ...onTab('requests'), text: 'Comments is where you can message the admin team about the event.' },
    { text: 'Tap the bell at the top any time to see all of your notifications in one place.', tut: 'bell', prepare: goCalendar },
    { text: 'Chat lets you message teammates directly or in groups.', tut: 'nav-chat', prepare: goCalendar, arrive: () => { selectEvent(null); setPage('chat'); } },
    { text: "That's everything — enjoy the UWW Event Calendar!", prepare: goCalendar },
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

  const GLIDE_MS = 650;

  useEffect(() => {
    const s = steps[idx];
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Hide the previous ring right away — it only reappears once the cursor lands.
    timers.push(setTimeout(() => setRingVisible(false), 0));
    // Get the target on screen (open the event etc.) but don't switch to its tab yet.
    s.prepare?.();

    timers.push(setTimeout(() => {
      const el = s.tut ? document.querySelector(`[data-tut="${s.tut}"]`) : null;
      if (!el) {
        // No target on this step: gently fade the cursor + ring out where they are.
        setCursorVisible(false);
        setRingVisible(false);
        return;
      }
      // Start the cursor gliding to the target; the ring stays hidden during travel.
      const r = el.getBoundingClientRect();
      setRect(r);
      setPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      setCursorVisible(true);
      // When the cursor arrives: open the screen/tab, then reveal the ring on the target.
      timers.push(setTimeout(() => {
        s.arrive?.();
        const fresh = (s.tut ? document.querySelector(`[data-tut="${s.tut}"]`) : null) || el;
        setRect(fresh.getBoundingClientRect());
        setRingVisible(true);
      }, GLIDE_MS + 80));
    }, 320));

    return () => timers.forEach(clearTimeout);
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
      {/* Highlight ring on the target — fades out instantly when leaving and only
          fades back in once the cursor has reached the new target (no positional drag). */}
      {rect && (
        <div
          style={{
            position: 'fixed', left: rect.left - 5, top: rect.top - 5, width: rect.width + 10, height: rect.height + 10,
            border: '2px solid var(--accent)', borderRadius: 10, boxShadow: '0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent)',
            pointerEvents: 'none', zIndex: 201, opacity: ringVisible ? 1 : 0,
            transition: ringVisible ? 'opacity .35s ease' : 'opacity .15s ease',
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
