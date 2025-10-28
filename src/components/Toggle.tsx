interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  labels?: {
    on: string;
    off: string;
  };
}

export default function Toggle({ value, onChange, labels = { on: 'Oui', off: 'Non' } }: ToggleProps) {
  return (
    <div
      className="
        relative
        flex items-center
        rounded-xl
        p-1
        bg-white
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
        w-fit
      "
    >
      {/* Sliding background */}
      <div
        className="
          absolute
          top-1
          h-[calc(100%-8px)]
          w-[calc(50%-4px)]
          bg-accent/10
          rounded-lg
          transition-all
          duration-300
          ease-in-out
        "
        style={{
          left: value ? 'calc(50% + 0px)' : '4px',
        }}
      />

      {/* Buttons */}
      <button
        onClick={() => onChange(false)}
        className={`
          relative
          z-10
          px-4 py-2
          rounded-lg
          transition-all duration-300
          text-sm font-medium
          min-w-[60px]
          ${!value
            ? 'text-accent'
            : 'text-neutral-60 hover:text-neutral-40'
          }
        `}
        aria-label={labels.off}
      >
        {labels.off}
      </button>
      <button
        onClick={() => onChange(true)}
        className={`
          relative
          z-10
          px-4 py-2
          rounded-lg
          transition-all duration-300
          text-sm font-medium
          min-w-[60px]
          ${value
            ? 'text-accent'
            : 'text-neutral-60 hover:text-neutral-40'
          }
        `}
        aria-label={labels.on}
      >
        {labels.on}
      </button>
    </div>
  );
}
