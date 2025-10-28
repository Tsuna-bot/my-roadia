import { Grid3x3, List } from 'lucide-react';

interface ViewToggleProps {
  value: 'grid' | 'list';
  onChange: (value: 'grid' | 'list') => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      className="
        relative
        flex items-center
        rounded-xl
        p-1
        bg-white
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
      "
    >
      {/* Sliding background */}
      <div
        className="
          absolute
          top-1
          h-[calc(100%-8px)]
          w-[calc(50%-4px)]
          bg-accent/10
          rounded-lg
          transition-all
          duration-300
          ease-in-out
        "
        style={{
          left: value === 'list' ? '4px' : 'calc(50% + 0px)',
        }}
      />

      {/* Buttons */}
      <button
        onClick={() => onChange('list')}
        className={`
          relative
          z-10
          px-4 py-2
          rounded-lg
          transition-all duration-300
          ${value === 'list'
            ? 'text-accent'
            : 'text-neutral-60 hover:text-neutral-40'
          }
        `}
        aria-label="Vue en liste"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`
          relative
          z-10
          px-4 py-2
          rounded-lg
          transition-all duration-300
          ${value === 'grid'
            ? 'text-accent'
            : 'text-neutral-60 hover:text-neutral-40'
          }
        `}
        aria-label="Vue en grille"
      >
        <Grid3x3 size={18} />
      </button>
    </div>
  );
}
