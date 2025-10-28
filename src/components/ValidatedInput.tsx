import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidatedInputProps {
  type: 'text' | 'email' | 'tel' | 'siret' | 'siren';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function ValidatedInput({
  type,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  className = '',
}: ValidatedInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!value) {
      setIsValid(null);
      setErrorMessage('');
      return;
    }

    // Immediate validation without delay
    validateInput(value);
  }, [value, type]);

  const validateInput = (val: string) => {
    let valid = true;
    let message = '';

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = emailRegex.test(val);
        message = valid ? '' : 'Format email invalide';
        break;

      case 'tel':
        // French phone number validation
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        valid = phoneRegex.test(val.replace(/\s/g, ''));
        message = valid ? '' : 'Format téléphone invalide';
        break;

      case 'siret':
        // SIRET: 14 digits
        const siretRegex = /^\d{14}$|^\d{3}\s\d{3}\s\d{3}\s\d{5}$/;
        valid = siretRegex.test(val.replace(/\s/g, ''));
        message = valid ? '' : 'SIRET invalide (14 chiffres requis)';
        break;

      case 'siren':
        // SIREN: 9 digits
        const sirenRegex = /^\d{9}$|^\d{3}\s\d{3}\s\d{3}$/;
        valid = sirenRegex.test(val.replace(/\s/g, ''));
        message = valid ? '' : 'SIREN invalide (9 chiffres requis)';
        break;

      default:
        valid = val.length > 0;
        message = valid ? '' : 'Ce champ est requis';
    }

    setIsValid(valid);
    setErrorMessage(message);
  };

  const getInputClasses = () => {
    const baseClasses = 'w-full p-4 text-sm rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-98 focus:outline-none transition-all duration-150';

    if (isValid === false) {
      return `${baseClasses} ring-2 ring-error/20 shadow-[0_0_0_2px_#EF4444_inset]`;
    }

    return `${baseClasses} focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_0_2px_#002f6b_inset]`;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-40 mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={type === 'siret' || type === 'siren' ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={getInputClasses()}
        />

        {/* Validation indicator - Only show error */}
        {value && isValid === false && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <AlertCircle size={18} className="text-error" />
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <p className="text-xs text-error mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
