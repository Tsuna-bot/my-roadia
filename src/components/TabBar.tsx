import { useEffect, useRef, useState } from 'react';
import { X, Plus, Folder } from 'lucide-react';
import { useTabs } from '../contexts/TabsContext';
import { useNavigation } from '../contexts/NavigationContext';
import IconButton from './IconButton';

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab } = useTabs();
  const { navigateTo } = useNavigation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const isMobile = window.innerWidth < 768;

  const handleAddTab = () => {
    const newTabId = `dossiers-${Date.now()}`;
    addTab({
      id: newTabId,
      type: 'dossiers',
      title: 'Tous les dossiers',
    });
    navigateTo('dossiers');
  };

  // Calculate slider position based on active tab element
  useEffect(() => {
    const activeTab = tabRefs.current[activeTabId];
    const container = tabsContainerRef.current;

    if (activeTab && container) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setSliderStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });

      // Auto-scroll to active tab
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const elementLeft = activeTab.offsetLeft;
        const elementWidth = activeTab.offsetWidth;
        const containerWidth = scrollContainer.offsetWidth;
        const scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);

        scrollContainer.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth',
        });
      }
    }
  }, [activeTabId, tabs]);

  return (
    <div
      className="
        fixed
        top-[64px] md:top-0
        left-0 md:left-[240px]
        right-0
        z-[1100]
        px-4 md:px-0
        pb-1 md:pb-0
      "
    >
      <div
        ref={scrollContainerRef}
        className="
          flex items-center
          gap-1
          bg-white/70 backdrop-blur-2xl backdrop-saturate-150 md:bg-white
          shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.2)] md:shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          px-4 md:px-6
          overflow-x-auto overflow-y-hidden
          h-[52px] md:h-[65px]
          scrollbar-thin scrollbar-thumb-neutral-85 scrollbar-track-transparent
          rounded-2xl md:rounded-none
          transition-all duration-300
          border border-white/20 md:border-0
        "
        style={{
          scrollSnapType: isMobile ? 'x proximity' : 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
      {/* Tabs Container with Background */}
      <div
        ref={tabsContainerRef}
        className="
          relative flex items-center gap-1
          rounded-xl
          p-1
          bg-neutral-95
          shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          flex-shrink-0
          h-[44px] md:h-[48px]
        "
      >
        {/* Sliding Background */}
        {sliderStyle.width > 0 && (
          <div
            className="
              absolute top-1
              h-[calc(100%-8px)]
              rounded-lg
              transition-all duration-300 ease-in-out
              z-0
            "
            style={{
              left: `${sliderStyle.left}px`,
              width: `${sliderStyle.width}px`,
              backgroundColor: 'rgba(0, 47, 107, 0.1)'
            }}
          />
        )}

        {tabs.map((tab) => (
          <div
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el as any;
            }}
            className="
              relative z-10
              flex items-center
              gap-1 md:gap-2
              px-4 md:px-6
              rounded-lg
              min-w-[140px] md:min-w-[180px]
              max-w-[250px] md:max-w-[300px]
              h-[32px] md:h-[36px]
              flex-shrink-0
              transition-all duration-300
              cursor-pointer
            "
            style={{ scrollSnapAlign: isMobile ? 'center' : 'none' }}
            onClick={() => setActiveTab(tab.id)}
          >
            <Folder
              size={isMobile ? 16 : 18}
              className={`
                flex-shrink-0 transition-colors duration-300
                ${activeTabId === tab.id ? 'text-accent' : 'text-neutral-60'}
              `}
            />
            <span
              className={`
                ${isMobile ? 'text-xs' : 'text-sm'}
                ${activeTabId === tab.id ? 'font-semibold text-accent' : 'font-medium text-neutral-60 hover:text-neutral-40'}
                whitespace-nowrap text-left
                transition-all duration-300
              `}
            >
              {tab.title}
            </span>
            {tab.id !== 'dossiers-main' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
                className="
                  w-[20px] md:w-[18px]
                  h-[20px] md:h-[18px]
                  flex items-center justify-center
                  text-neutral-60
                  transition-all duration-150
                  flex-shrink-0
                  rounded-full
                  hover:text-neutral-10 hover:bg-neutral-95
                "
              >
                <X size={isMobile ? 16 : 14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Tab Button */}
      <IconButton
        onClick={handleAddTab}
        size="small"
        className="
          ml-2
          flex-shrink-0
          text-neutral-40
          hover:bg-neutral-98 hover:text-accent
        "
      >
        <Plus size={isMobile ? 22 : 20} />
      </IconButton>
      </div>
    </div>
  );
}
