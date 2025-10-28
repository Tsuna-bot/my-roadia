import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigation } from './NavigationContext';

export interface Tab {
  id: string;
  type: 'dossiers' | 'folder-details';
  title: string;
  folderId?: string;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabId: string;
  addTab: (tab: Tab) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  openFolder: (folderId: string, folderReference: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: ReactNode }) {
  const navigation = useNavigation();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'dossiers-main', type: 'dossiers', title: 'Tous les dossiers' },
  ]);
  const [activeTabId, setActiveTabId] = useState('dossiers-main');

  const addTab = (tab: Tab) => {
    const existingTab = tabs.find((t) => t.id === tab.id);
    if (existingTab) {
      setActiveTabId(tab.id);
      return;
    }

    setTabs([...tabs, tab]);
    setActiveTabId(tab.id);
  };

  const removeTab = (tabId: string) => {
    if (tabs.length === 1 || tabId === 'dossiers-main') return;

    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);

      // Navigate to the appropriate view
      if (newActiveTab.type === 'dossiers') {
        navigation.navigateTo('dossiers');
      } else if (newActiveTab.type === 'folder-details' && newActiveTab.folderId) {
        navigation.navigateTo('folder-details', newActiveTab.folderId);
      }
    }
  };

  const handleSetActiveTab = (tabId: string) => {
    setActiveTabId(tabId);

    // Navigate to the appropriate view based on tab type
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      if (tab.type === 'dossiers') {
        navigation.navigateTo('dossiers');
      } else if (tab.type === 'folder-details' && tab.folderId) {
        navigation.navigateTo('folder-details', tab.folderId);
      }
    }
  };

  const openFolder = (folderId: string, folderReference: string) => {
    const tabId = `folder-${folderId}`;
    const existingFolderTab = tabs.find((t) => t.id === tabId);

    navigation.navigateTo('folder-details', folderId);

    if (existingFolderTab) {
      setActiveTabId(tabId);
      return;
    }

    const currentTab = tabs.find((t) => t.id === activeTabId);

    if (currentTab && currentTab.type === 'dossiers' && currentTab.id !== 'dossiers-main') {
      const newTabs = tabs.map((t) =>
        t.id === activeTabId
          ? {
              id: tabId,
              type: 'folder-details' as const,
              title: folderReference,
              folderId,
            }
          : t
      );
      setTabs(newTabs);
      setActiveTabId(tabId);
    } else {
      const newTab: Tab = {
        id: tabId,
        type: 'folder-details',
        title: folderReference,
        folderId,
      };
      addTab(newTab);
    }
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        removeTab,
        setActiveTab: handleSetActiveTab,
        openFolder,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}
