interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function Divider({ className = '', orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={`w-px h-full bg-neutral-90 ${className}`} />;
  }

  return <div className={`w-full h-px bg-neutral-90 ${className}`} />;
}
