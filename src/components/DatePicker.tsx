import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'neutral' | 'white'; // neutral = bg-neutral-95, white = bg-white
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Sélectionner une date',
  className = '',
  disabled = false,
  variant = 'neutral',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openUpward, setOpenUpward] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parse the value to display formatted date
  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00'); // Add time to avoid timezone issues
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Check if picker should open upward based on position
  useEffect(() => {
    if (isOpen && pickerRef.current && !isMobile) {
      const rect = pickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const pickerHeight = 400; // Approximate height of the picker

      // Open upward if not enough space below but enough space above
      setOpenUpward(spaceBelow < pickerHeight && spaceAbove > pickerHeight);
    }
  }, [isOpen, isMobile]);

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

  // Get days in month
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 7 to make Monday first day
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  // Check if date is selected
  const isDateSelected = (day: number): boolean => {
    if (!value) return false;
    const selectedDate = new Date(value + 'T00:00:00');
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Check if date is today
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const calendarDays = generateCalendarDays();
  const bgClass = variant === 'white' ? 'bg-white' : 'bg-neutral-95';

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      {/* Trigger Input */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label={value ? `Date sélectionnée: ${formatDisplayDate(value)}` : placeholder}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`
          w-full p-4 text-sm rounded-xl text-left
          ${bgClass} shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          border-0 outline-none
          hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
          focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
          transition-all duration-[250ms]
          flex items-center justify-between gap-2
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'shadow-[0_2px_8px_rgba(0,47,107,0.15)]' : ''}
        `}
      >
        <span className={value ? 'text-neutral-10' : 'text-neutral-60'}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Calendar size={18} className="text-neutral-60 flex-shrink-0" aria-hidden="true" />
      </button>

      {/* Calendar Dropdown/Modal */}
      {isOpen && !disabled && (
        <>
          {/* Mobile: Backdrop */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Calendar */}
          <div
            role="dialog"
            aria-label="Sélecteur de date"
            aria-modal={isMobile}
            className={`
              bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-xl
              p-6
              ${isMobile
                ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-[360px] animate-scale-in'
                : openUpward
                  ? 'absolute bottom-full mb-1 left-0 z-50 w-[320px] animate-slide-up'
                  : 'absolute top-full mt-1 left-0 z-50 w-[320px] animate-slide-down'
              }
            `}
          >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPreviousMonth}
              aria-label="Mois précédent"
              className="p-2 rounded-lg hover:bg-neutral-95 transition-colors duration-150"
            >
              <ChevronLeft size={20} className="text-neutral-40" aria-hidden="true" />
            </button>
            <div className="text-sm font-semibold text-neutral-10" aria-live="polite">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </div>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Mois suivant"
              className="p-2 rounded-lg hover:bg-neutral-95 transition-colors duration-150"
            >
              <ChevronRight size={20} className="text-neutral-40" aria-hidden="true" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-1" role="row">
            {weekDays.map((day, index) => (
              <div
                key={`weekday-${index}`}
                role="columnheader"
                aria-label={['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][index]}
                className="text-xs font-medium text-neutral-60 text-center py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const selected = isDateSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  aria-label={`${day} ${currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}
                  aria-pressed={selected}
                  aria-current={today ? 'date' : undefined}
                  className={`
                    aspect-square
                    flex items-center justify-center
                    text-sm font-medium
                    rounded-lg
                    transition-all duration-150
                    ${
                      selected
                        ? 'bg-accent text-white'
                        : today
                        ? 'bg-accent/10 text-accent'
                        : 'text-neutral-10 hover:bg-neutral-95'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-neutral-90">
            {isMobile ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    onChange(`${year}-${month}-${day}`);
                    setIsOpen(false);
                  }}
                  className="
                    w-full py-4 px-4
                    text-sm font-semibold text-white
                    bg-accent rounded-lg
                    hover:bg-accent-dark
                    transition-colors duration-150
                  "
                >
                  Aujourd'hui
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                    w-full py-4 px-4
                    text-sm font-medium text-neutral-40
                    bg-neutral-95 rounded-lg
                    hover:bg-neutral-90
                    transition-colors duration-150
                  "
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = String(today.getMonth() + 1).padStart(2, '0');
                  const day = String(today.getDate()).padStart(2, '0');
                  onChange(`${year}-${month}-${day}`);
                  setIsOpen(false);
                }}
                className="
                  w-full py-2 px-4
                  text-sm font-medium text-accent
                  rounded-lg
                  hover:bg-accent/10
                  transition-colors duration-150
                "
              >
                Aujourd'hui
              </button>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
