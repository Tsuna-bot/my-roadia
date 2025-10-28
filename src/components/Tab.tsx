import { ReactNode } from 'react';

interface TabProps {
  label: string;
  icon?: ReactNode;
  iconPosition?: 'top' | 'start' | 'end';
  onClick?: (event: React.MouseEvent) => void;
  selected?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Tab({
  label,
  icon,
  iconPosition = 'start',
  onClick,
  selected = false,
  fullWidth = false,
  className = ''
}: TabProps) {
  const flexDirection = {
    top: 'flex-col',
    start: 'flex-row',
    end: 'flex-row-reverse'
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative
        z-10
        flex items-center justify-center
        ${flexDirection[iconPosition]}
        gap-2
        px-6 py-4
        text-sm font-semibold
        rounded-lg
        transition-all duration-300
        ${selected ? 'text-accent' : 'text-neutral-60 hover:text-neutral-40'}
        ${fullWidth ? 'flex-1' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
