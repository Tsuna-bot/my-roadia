import { ReactNode, Children, isValidElement, cloneElement } from 'react';

interface TabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  children: ReactNode;
  variant?: 'standard' | 'fullWidth';
  centered?: boolean;
  className?: string;
}

export default function Tabs({
  value,
  onChange,
  children,
  variant = 'standard',
  className = ''
}: TabsProps) {
  const handleClick = (index: number) => (event: React.MouseEvent) => {
    onChange(event as any, index);
  };

  const childCount = Children.count(children);

  return (
    <div className={`relative flex items-center rounded-xl p-1 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${className}`}>
      {/* Sliding background */}
      <div
        className="absolute top-1 h-[calc(100%-8px)] rounded-lg transition-all duration-300 ease-in-out z-0"
        style={{
          left: `${(value / childCount) * 100 + 0.5}%`,
          width: `${100 / childCount - 1}%`,
          backgroundColor: 'rgba(0, 47, 107, 0.1)'
        }}
      />

      {/* Tabs */}
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as any, {
            onClick: handleClick(index),
            selected: value === index,
            index,
            fullWidth: variant === 'fullWidth'
          });
        }
        return child;
      })}
    </div>
  );
}
