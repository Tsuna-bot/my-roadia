import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'neutral';
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Sélectionner...',
  className = '',
  disabled = false,
  variant = 'default',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Detect if dropdown should open upward or downward
  useEffect(() => {
    if (isOpen && selectRef.current && dropdownRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      const dropdownHeight = Math.min(240, options.length * 40); // Estimate dropdown height
      const spaceBelow = window.innerHeight - selectRect.bottom;
      const spaceAbove = selectRect.top;

      // Open upward if there's not enough space below but enough space above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen, options.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const bgClass = variant === 'neutral' ? 'bg-neutral-95' : 'bg-neutral-95';

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 h-[44px] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          ${bgClass} text-sm text-left
          border-0 outline-none
          focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
          transition-all duration-[250ms]
          flex items-center justify-between gap-2
          ${disabled ? 'bg-neutral-95 cursor-not-allowed opacity-40' : 'cursor-pointer hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]'}
          ${isOpen ? 'shadow-[0_2px_8px_rgba(0,47,107,0.15)]' : ''}
        `}
      >
        <span className={selectedOption ? 'text-neutral-10' : 'text-neutral-60'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`
            text-neutral-60 transition-transform duration-150 flex-shrink-0
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`
            absolute left-0 right-0
            bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-xl shadow-lg
            max-h-[240px] overflow-y-auto
            z-50
            ${openUpward ? 'bottom-full mb-1 animate-slide-up' : 'top-full mt-1 animate-slide-down'}
          `}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-2 text-left text-base
                flex items-center justify-between gap-2
                transition-colors duration-150
                ${
                  option.value === value
                    ? 'bg-accent/5 text-accent font-medium'
                    : 'text-neutral-10 hover:bg-neutral-98'
                }
              `}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check size={18} className="text-accent flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
