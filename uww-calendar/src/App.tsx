import { useEffect } from 'react';
import { useStore, currentUser, effectiveView } from './store';
import Avatar from './components/common/Avatar';
import Sidebar from './components/layout/Sidebar';
import MobileTabBar from './components/layout/MobileTabBar';
import TopBar from './components/layout/TopBar';
import CalendarGrid from './components/calendar/CalendarGrid';
import TableView from './components/calendar/TableView';
import EventDetail from './components/event/EventDetail';
import StaffPage from './components/pages/StaffPage';
import ArchivePage from './components/pages/ArchivePage';
import TemplatesPage from './components/pages/TemplatesPage';
import ChatPage from './components/pages/ChatPage';
import NewEventOverlay from './components/overlays/NewEventOverlay';
import ImportOverlay from './components/overlays/ImportOverlay';
import FilterPopup from './components/overlays/FilterPopup';
import DocEditor from './components/overlays/DocEditor';
import LinkSetup from './components/overlays/LinkSetup';
import ProfileModal from './components/overlays/ProfileModal';
import ContextMenu from './components/overlays/ContextMenu';
import TutorialOverlay from './components/overlays/TutorialOverlay';
import DmOverlay from './components/overlays/DmOverlay';

export default function App() {
  const theme = useStore(s => s.theme);
  const viewMode = useStore(s => s.viewMode);
  const isNarrow = useStore(s => s.isNarrow);
  const view = useStore(effectiveView);
  const setIsNarrow = useStore(s => s.setIsNarrow);
  const cu = useStore(currentUser);
  const openProfile = useStore(s => s.openProfile);
  const page = useStore(s => s.page);
  const calView = useStore(s => s.calView);
  const selectedEventId = useStore(s => s.selectedEventId);
  const showNewEvent = useStore(s => s.showNewEvent);
  const showImport = useStore(s => s.showImport);
  const showFilter = useStore(s => s.showFilter);
  const showProfile = useStore(s => s.showProfile);
  const showTutorial = useStore(s => s.showTutorial);
  const docEditorOpen = useStore(s => s.docEditorOpen);
  const linkSetupOpen = useStore(s => s.linkSetupOpen);
  const contextMenu = useStore(s => s.contextMenu);
  const dmOverlay = useStore(s => s.dmOverlay);

  useEffect(() => {
    document.body.style.background = 'var(--bg)';
  }, [theme]);

  // Auto-detect a narrow (real phone) screen and switch to the mobile layout.
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 760);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setIsNarrow]);

  let pageContent: React.ReactNode = null;
  if (selectedEventId) {
    pageContent = <EventDetail />;
  } else if (page === 'calendar') {
    pageContent = calView === 'calendar' ? <CalendarGrid /> : <TableView />;
  } else if (page === 'staff') {
    pageContent = <StaffPage />;
  } else if (page === 'archive') {
    pageContent = <ArchivePage />;
  } else if (page === 'templates') {
    pageContent = <TemplatesPage />;
  } else if (page === 'chat') {
    pageContent = <ChatPage />;
  }

  return (
    <div
      className={`app-root${view === 'mobile' ? ' mobilelayout' : ''}${!isNarrow && viewMode === 'mobile' ? ' frame' : ''}`}
      data-app-theme={theme}
      data-view={view}
      style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}
    >
      {view === 'mobile' ? <MobileTabBar /> : <Sidebar />}
      <main
        className="uww-main"
        style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
      >
        <TopBar />
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {pageContent}
        </div>
      </main>

      {showNewEvent && <NewEventOverlay />}
      {showImport && <ImportOverlay />}
      {showFilter && <FilterPopup />}
      {showProfile && <ProfileModal />}
      {showTutorial && <TutorialOverlay />}
      {docEditorOpen && <DocEditor />}
      {linkSetupOpen && <LinkSetup />}
      {contextMenu && <ContextMenu />}
      {dmOverlay && <DmOverlay />}

      {/* Mobile-only floating profile button */}
      <button
        className="uww-mobile-me"
        onClick={openProfile}
        aria-label="Profile"
        style={{
          position: 'fixed', right: 14, bottom: 74, zIndex: 58,
          width: 48, height: 48, borderRadius: '50%', padding: 0, border: 'none',
          background: 'transparent', cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(241,90,34,.4)',
        }}
      >
        <Avatar staffId={cu} size={46} confirmed />
      </button>
    </div>
  );
}
