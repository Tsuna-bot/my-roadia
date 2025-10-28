interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  as?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  as,
}: ButtonProps) {
  // Base classes - common to all buttons
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-[250ms] focus-visible:outline-2 focus-visible:outline-[#002f6b] focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent/90',
    secondary: 'bg-neutral-95 text-neutral-10 hover:bg-neutral-90',
    tertiary: 'bg-transparent text-accent shadow-[0_0_0_2px_#002f6b_inset] hover:bg-accent hover:text-white',
  };

  // Size classes
  const sizeClasses = {
    small: 'px-4 py-1 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  // If using as="div", render as div (for label wrapping)
  if (as === 'div') {
    return (
      <div className={combinedClasses}>
        {children}
      </div>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}
