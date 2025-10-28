import { ReactNode } from 'react';

interface ChipProps {
  label: string | ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'default';
  size?: 'small' | 'medium';
  className?: string;
}

export default function Chip({ label, variant = 'default', size = 'medium', className = '' }: ChipProps) {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'badge-neutral',
    default: 'bg-neutral-95 text-neutral-40 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-1 h-[22px]',
    medium: 'text-sm px-4 py-1 h-[28px]'
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {label}
    </span>
  );
}
