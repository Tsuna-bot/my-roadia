interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  className = ''
}: ToggleSwitchProps) {
  return (
    <label
      className={`
        flex items-center gap-2 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div
        className={`
          relative inline-block w-[44px] h-[24px]
          rounded-full
          transition-all duration-[250ms]
          ${checked ? 'bg-accent' : 'bg-neutral-85'}
          ${disabled ? '' : 'hover:opacity-90'}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <div
          className={`
            absolute top-[2px]
            w-[20px] h-[20px]
            bg-white
            rounded-full
            shadow-[0_1px_3px_rgba(0,0,0,0.2)]
            transition-all duration-[250ms]
            ${checked ? 'left-[22px]' : 'left-[2px]'}
          `}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-neutral-10">
          {label}
        </span>
      )}
    </label>
  );
}
