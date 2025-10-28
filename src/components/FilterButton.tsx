import { useState } from 'react';
import { Filter } from 'lucide-react';
import Menu from './Menu';
import MenuItem from './MenuItem';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterButtonProps {
  selected: string;
  onChange: (filter: string) => void;
  filters?: FilterOption[];
  className?: string;
}

const defaultFilters: FilterOption[] = [
  { value: 'all', label: 'Tous' },
  { value: 'priority', label: 'Prioritaire' },
  { value: 'Réception de la mission', label: 'Réception de la mission' },
  { value: 'Étude de la mission', label: 'Étude de la mission' },
  { value: 'Planification d\'un examen', label: 'Planification d\'un examen' },
  { value: 'Examen initial', label: 'Examen initial' },
  { value: 'Cession', label: 'Cession' },
  { value: 'Complétion d\'un dossier à distance', label: 'Complétion d\'un dossier à distance' },
  { value: 'Réparations', label: 'Réparations' },
];

export default function FilterButton({ selected, onChange, filters = defaultFilters, className = '' }: FilterButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    handleClose();
  };

  const selectedLabel = filters.find((f) => f.value === selected)?.label || 'Tous';

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          flex items-center justify-center gap-2
          px-6 py-2
          rounded-xl
          text-sm font-medium
          text-neutral-20
          bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          md:hover:shadow-md
          transition-all duration-150
          focus-ring
          ${className}
        `}
      >
        <Filter size={18} />
        Filtrer: {selectedLabel}
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {filters.map((filter) => (
          <MenuItem
            key={filter.value}
            onClick={() => handleSelect(filter.value)}
            className={selected === filter.value ? 'bg-neutral-95 font-semibold' : ''}
          >
            {filter.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
