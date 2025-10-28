import { useState } from 'react';
import { SideNavProvider } from './contexts/SideNavContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { TabsProvider, useTabs } from './contexts/TabsContext';
import LoginPage from './components/LoginPage';
import SideNav from './components/SideNav';
import MobileHeader from './components/MobileHeader';
import TabBar from './components/TabBar';
import DashboardReparateur from './components/DashboardReparateur';
import DashboardAssureur from './components/DashboardAssureur';
import DashboardInsured from './components/DashboardInsured';
import DossiersPage from './components/DossiersPage';
import FolderDetails from './components/FolderDetails';
import FolderDetailsInsured from './components/FolderDetailsInsured';
import TarifsPage from './components/TarifsPage';
import MessageriePage from './components/MessageriePage';
import ProfileReparateur from './components/ProfileReparateur';
import ProfileAssureur from './components/ProfileAssureur';
import ProfileAssure from './components/ProfileAssure';

type UserType = 'reparateur' | 'assureur' | 'assure' | null;

function AppContent({ userType }: { userType: 'reparateur' | 'assureur' | 'assure' }) {
  const { currentView } = useNavigation();
  const { tabs, activeTabId } = useTabs();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine current content based on view and active tab
  const renderContent = () => {
    // If there's an active tab (folder open), show folder details
    if (currentView === 'folder-details' && activeTabId && tabs.length > 0) {
      const activeTabData = tabs.find(tab => tab.id === activeTabId);
      const folderId = activeTabData?.folderId;

      if (folderId) {
        // Show appropriate FolderDetails based on user type
        if (userType === 'assure') {
          return <FolderDetailsInsured folderId={folderId} />;
        } else {
          return <FolderDetails folderId={folderId} />;
        }
      }
    }

    // Otherwise, show view-based content
    switch (currentView) {
      case 'dossiers':
        // Pour les assurés, filtrer les dossiers par leur nom
        return userType === 'assure'
          ? <DossiersPage clientName="Jean Martin" />
          : <DossiersPage />;

      case 'messages':
        return <MessageriePage />;

      case 'tarifs':
        return <TarifsPage />;

      case 'profile':
        // Show appropriate profile based on user type
        if (userType === 'reparateur') return <ProfileReparateur />;
        if (userType === 'assureur') return <ProfileAssureur />;
        if (userType === 'assure') return <ProfileAssure />;
        return null;

      case 'dashboard':
      default:
        // Show appropriate dashboard based on user type
        if (userType === 'reparateur') return <DashboardReparateur />;
        if (userType === 'assureur') return <DashboardAssureur />;
        if (userType === 'assure') return <DashboardInsured />;
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-98">
      {/* SideNav */}
      <SideNav
        userType={userType}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-[240px] transition-all duration-[250ms]">
        {/* Mobile Header */}
        <MobileHeader
          isMenuOpen={mobileMenuOpen}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* TabBar - Only show when there are open tabs and in dossiers or folder-details view */}
        {tabs.length > 0 && (currentView === 'dossiers' || currentView === 'folder-details') && <TabBar />}

        {/* Main Content */}
        <main className={`flex-1 overflow-auto bg-neutral-98 ${tabs.length > 0 && (currentView === 'dossiers' || currentView === 'folder-details') ? 'pt-[120px] md:pt-[65px]' : 'pt-[68px] md:pt-0'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);

  const handleLogin = (type: 'reparateur' | 'assureur' | 'assure') => {
    setUserType(type);
  };

  // Login page if not connected
  if (!userType) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Main application after login
  return (
    <SideNavProvider>
      <NavigationProvider>
        <TabsProvider>
          <AppContent userType={userType} />
        </TabsProvider>
      </NavigationProvider>
    </SideNavProvider>
  );
}
