import { ReactNode } from 'react';

interface MenuItemProps {
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function MenuItem({
  onClick,
  children,
  disabled = false,
  className = ''
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        flex items-center
        px-6 py-2
        text-sm text-left
        text-neutral-20
        hover:bg-neutral-95
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors duration-150
        ${className}
      `}
    >
      {children}
    </button>
  );
}
