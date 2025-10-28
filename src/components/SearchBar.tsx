import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  placeholderMobile?: string;
  onSearch?: (query: string) => void;
  variant?: 'default' | 'neutral';
}

export default function SearchBar({
  placeholder = 'Rechercher par dossier, véhicule ou client...',
  placeholderMobile,
  onSearch,
  variant = 'default'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const bgClass = variant === 'neutral' ? 'bg-neutral-95' : 'bg-white';
  const displayPlaceholder = isMobile && placeholderMobile ? placeholderMobile : placeholder;

  return (
    <div className="w-full">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-60"
          size={20}
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={displayPlaceholder}
          className={`
            w-full
            pl-[56px] pr-6 py-4
            ${bgClass}
            !border-0
            !outline-none
            !ring-0
            shadow-[0_1px_3px_rgba(0,0,0,0.08)]
            rounded-xl
            text-sm md:text-base
            text-neutral-10
            placeholder:text-neutral-60
            transition-all duration-[250ms]
            hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
            focus:outline-none focus:ring-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
          `}
        />
      </div>
    </div>
  );
}
