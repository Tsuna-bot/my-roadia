import { createContext, useContext, useState, ReactNode } from 'react';

type View = 'dashboard' | 'dossiers' | 'folder-details' | 'messages' | 'tarifs' | 'profile';

interface NavigationContextType {
  currentView: View;
  selectedFolderId: string | null;
  profileAutoEditSchedule: boolean;
  navigateTo: (view: View, folderId?: string) => void;
  navigateToProfileSchedule: () => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [profileAutoEditSchedule, setProfileAutoEditSchedule] = useState(false);

  const navigateTo = (view: View, folderId?: string) => {
    setCurrentView(view);
    setProfileAutoEditSchedule(false);
    if (folderId) {
      setSelectedFolderId(folderId);
    }
  };

  const navigateToProfileSchedule = () => {
    setCurrentView('profile');
    setProfileAutoEditSchedule(true);
  };

  const goBack = () => {
    setCurrentView('dashboard');
    setSelectedFolderId(null);
    setProfileAutoEditSchedule(false);
  };

  return (
    <NavigationContext.Provider value={{ currentView, selectedFolderId, profileAutoEditSchedule, navigateTo, navigateToProfileSchedule, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
