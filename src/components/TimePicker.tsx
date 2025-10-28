import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string; // Format: HH:mm
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = 'Sélectionner une heure',
  className = '',
  disabled = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  // Parse the value to display formatted time
  const formatDisplayTime = (timeStr: string): string => {
    if (!timeStr) return '';
    return timeStr;
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
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

  // Generate time slots (00:00 to 23:30 by 30min intervals)
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      const hour = String(h).padStart(2, '0');
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      {/* Trigger Input */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full p-4 text-sm md:text-sm rounded-xl text-left
          bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          border-0 outline-none
          hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
          focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
          transition-all duration-[250ms]
          flex items-center justify-between gap-2
          h-[48px] md:h-[44px]
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'shadow-[0_2px_8px_rgba(0,47,107,0.15)]' : ''}
        `}
      >
        <span className={`text-base md:text-sm ${value ? 'text-neutral-10' : 'text-neutral-60'}`}>
          {value ? formatDisplayTime(value) : placeholder}
        </span>
        <Clock size={isMobile ? 20 : 18} className="text-neutral-60 flex-shrink-0" />
      </button>

      {/* Time Picker Dropdown/Modal */}
      {isOpen && !disabled && (
        <>
          {/* Mobile: Backdrop */}
          {isMobile && (
            <div
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[1400]"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Picker Content */}
          <div
            className={`
              z-[1401]
              bg-white rounded-xl
              shadow-[0_4px_12px_rgba(0,0,0,0.15)]
              ${isMobile
                ? 'fixed bottom-0 left-0 right-0 mx-4 mb-4 rounded-2xl max-h-[60vh] p-6'
                : 'absolute top-full mt-1 left-0 w-[200px] animate-slide-down p-4'
              }
            `}
          >
            {/* Header */}
            <div className={`font-semibold text-neutral-10 mb-4 ${isMobile ? 'text-base' : 'text-sm'}`}>
              Sélectionner une heure
            </div>

            {/* Time Selection List */}
            <div className={`overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-85 scrollbar-track-transparent ${isMobile ? 'max-h-[50vh]' : 'max-h-[300px]'}`}>
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    w-full rounded-lg text-center font-medium
                    transition-all duration-150
                    ${isMobile ? 'py-4 px-6 text-lg h-[56px]' : 'py-2 px-4 text-sm'}
                    ${
                      time === value
                        ? 'bg-accent text-white'
                        : 'text-neutral-10 hover:bg-neutral-95 active:bg-neutral-90'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
