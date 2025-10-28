import { Menu, X } from 'lucide-react';
import Logo from './Logo';

interface MobileHeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
}

export default function MobileHeader({ onMenuClick, isMenuOpen }: MobileHeaderProps) {
  return (
    <div
      className="
        md:hidden
        fixed top-0 left-0 right-0
        px-4 pt-2 pb-1
        z-[1300]
      "
      style={{
        paddingTop: 'max(8px, env(safe-area-inset-top))',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
      }}
    >
      <div
        className="
          bg-white/70 backdrop-blur-2xl backdrop-saturate-150
          shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.2)]
          rounded-2xl
          flex items-center justify-between
          px-6 py-2
          h-[52px]
          transition-all duration-300
          border border-white/20
        "
      >
        <Logo width={90} />

        <button
          onClick={onMenuClick}
          className="
            relative
            w-10 h-10
            flex items-center justify-center
            text-neutral-10
            hover:bg-accent/5 active:bg-accent/10
            rounded-full
            transition-all duration-150
            active:scale-95
          "
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
        <div className="relative w-6 h-6">
          <Menu
            size={24}
            className={`
              absolute top-0 left-0
              transition-all duration-300
              ${isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
            `}
          />
          <X
            size={24}
            className={`
              absolute top-0 left-0
              transition-all duration-300
              ${isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
            `}
          />
        </div>
      </button>
      </div>
    </div>
  );
}
