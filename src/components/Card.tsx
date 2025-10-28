import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevation?: number;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Card({ children, className = '', elevation = 0, onClick, style }: CardProps) {
  const elevationClass = elevation > 0 ? `elevation-${Math.min(elevation, 3)}` : '';

  return (
    <div className={`card ${elevationClass} ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
}
