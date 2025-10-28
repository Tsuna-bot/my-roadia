interface LinearProgressProps {
  value: number;
  className?: string;
}

export default function LinearProgress({ value, className = '' }: LinearProgressProps) {
  return (
    <div className={`w-full h-2 bg-neutral-90 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-accent rounded-full transition-all duration-[250ms]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
