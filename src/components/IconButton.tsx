import { ReactNode } from 'react';

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
}

export default function IconButton({
  children,
  onClick,
  size = 'medium',
  className = '',
  disabled = false
}: IconButtonProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        rounded-full
        text-neutral-40
        hover:bg-neutral-95
        active:bg-neutral-90
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        focus-visible:outline-2 focus-visible:outline-[#002f6b] focus-visible:outline-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  );
}
