import { Home, Folder, Mail, Euro, TrendingUp } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import Logo from './Logo';
import Divider from './Divider';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  view: 'dashboard' | 'dossiers' | 'messages' | 'tarifs';
  hideForInsured?: boolean;
  labelForInsurer?: string;
  iconForInsurer?: React.ReactElement;
  labelForRepairer?: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: <Home size={22} />, view: 'dashboard' },
  {
    id: 'folders',
    label: 'Mes sinistres',
    labelForInsurer: 'Dossiers',
    labelForRepairer: 'Dossiers',
    icon: <Folder size={22} />,
    view: 'dossiers'
  },
  { id: 'messages', label: 'Messagerie', icon: <Mail size={22} />, view: 'messages' },
  {
    id: 'pricing',
    label: 'Tarifs',
    icon: <Euro size={22} />,
    view: 'tarifs',
    hideForInsured: true,
    labelForInsurer: 'Statistiques',
    iconForInsurer: <TrendingUp size={22} />
  },
];

interface SideNavProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  userType?: 'reparateur' | 'assureur' | 'assure';
}

export default function SideNav({ mobileOpen = false, onMobileClose, userType = 'reparateur' }: SideNavProps) {
  const { navigateTo, currentView } = useNavigation();
  const isMobile = window.innerWidth < 768;

  const handleNavClick = (view: 'dashboard' | 'dossiers' | 'messages' | 'tarifs') => {
    navigateTo(view);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  // Filter navigation items based on user type
  const filteredNavItems = navItems.filter(item => {
    if (userType === 'assure' && item.hideForInsured) {
      return false;
    }
    return true;
  });

  // Get user info based on type
  const getUserInfo = () => {
    switch (userType) {
      case 'assureur':
        return { initials: 'CM', name: 'Christophe Mithieux', role: 'Resp. Gestion Sinistres' };
      case 'assure':
        return { initials: 'JM', name: 'Jean Martin', role: 'Assuré' };
      default:
        return { initials: 'JD', name: 'John Doe', role: 'Expert Automobile' };
    }
  };

  const userInfo = getUserInfo();

  const drawerContent = (
    <div className="h-full flex flex-col md:bg-white">
      {/* Header - Desktop only */}
      {!isMobile && (
        <div className="flex items-center justify-start h-[65px] px-4">
          <Logo width={100} />
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 py-2 px-2 flex flex-col gap-1">
        {filteredNavItems.map((item) => {
          // Use user-type-specific label and icon if applicable
          let displayLabel = item.label;
          if (userType === 'assureur' && item.labelForInsurer) {
            displayLabel = item.labelForInsurer;
          } else if (userType === 'reparateur' && item.labelForRepairer) {
            displayLabel = item.labelForRepairer;
          }

          const displayIcon = (userType === 'assureur' && item.iconForInsurer) ? item.iconForInsurer : item.icon;
          // Also activate "Dossiers" when viewing folder details
          const isSelected = currentView === item.view || (item.view === 'dossiers' && currentView === 'folder-details');

          return (
            <div key={item.id}>
              <button
                onClick={() => handleNavClick(item.view)}
                className={`
                  w-full
                  flex items-center
                  justify-start px-2
                  gap-2
                  ${isMobile ? 'h-[44px]' : 'h-[40px]'}
                  rounded-md
                  transition-all duration-[250ms]
                  ${isSelected
                    ? 'bg-accent/10 text-accent'
                    : 'text-neutral-40 hover:bg-neutral-95'
                  }
                `}
              >
                <span className={`flex-shrink-0 ${isSelected ? 'text-accent' : 'text-neutral-40'}`}>
                  {displayIcon}
                </span>
                <span className={`
                  ${isMobile ? 'text-md' : 'text-sm'}
                  ${isSelected ? 'font-semibold' : 'font-medium'}
                  whitespace-nowrap
                `}>
                  {displayLabel}
                </span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <Divider />
      <button
        onClick={() => {
          navigateTo('profile');
          if (isMobile && onMobileClose) {
            onMobileClose();
          }
        }}
        className="
          flex items-center
          justify-start px-4
          gap-2
          min-h-[72px]
          transition-colors duration-150
          hover:bg-neutral-95
        "
        aria-label="Profil utilisateur"
      >
        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-md font-semibold flex-shrink-0">
          {userInfo.initials}
        </div>
        <div className="flex flex-col overflow-hidden whitespace-nowrap text-left">
          <span className="text-sm font-semibold text-neutral-10 leading-tight">
            {userInfo.name}
          </span>
          <span className="text-xs text-neutral-60 leading-tight">
            {userInfo.role}
          </span>
        </div>
      </button>
    </div>
  );

  // Mobile: Dropdown from header
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {mobileOpen && (
          <div
            onClick={onMobileClose}
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[1199] animate-fade-in"
          />
        )}

        {/* Dropdown menu */}
        <div
          className={`
            md:hidden fixed top-[68px] left-4 right-4
            bg-white/95 backdrop-blur-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]
            z-[1200]
            rounded-2xl
            transition-all duration-300 origin-top
            max-h-[calc(100vh-80px)]
            overflow-y-auto
            ${mobileOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}
          `}
        >
          {drawerContent}
        </div>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <nav
      className="
        hidden md:flex
        fixed left-0 top-0 h-screen
        w-[240px]
        bg-white border-r-0
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
        flex-col
        overflow-hidden
        z-[1200]
      "
    >
      {drawerContent}
    </nav>
  );
}
