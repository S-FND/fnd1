import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { formatNumberWithCommas, parseFormattedNumber } from '@/lib/formatNumber';

interface FormattedNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string | number | undefined;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * A number input that displays values with comma separators
 * but stores the raw number value
 */
export const FormattedNumberInput = React.forwardRef<HTMLInputElement, FormattedNumberInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);

    // Update display value when external value changes (and not focused)
    React.useEffect(() => {
      if (!isFocused) {
        const rawValue = String(value || '');
        setDisplayValue(formatNumberWithCommas(rawValue));
      }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty input
      if (inputValue === '') {
        setDisplayValue('');
        onChange('');
        return;
      }
      
      // Remove commas to get raw value
      const rawValue = parseFormattedNumber(inputValue);
      
      // Only allow valid number characters
      if (!/^\d*\.?\d*$/.test(rawValue)) {
        return;
      }
      
      // Update display with formatted value
      setDisplayValue(formatNumberWithCommas(rawValue));
      
      // Pass raw value to parent
      onChange(rawValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
      // Show raw value when focused for easier editing
      const rawValue = parseFormattedNumber(displayValue);
      setDisplayValue(rawValue);
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Format value when leaving field
      const rawValue = parseFormattedNumber(displayValue);
      setDisplayValue(formatNumberWithCommas(rawValue));
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(className)}
        {...props}
      />
    );
  }
);

FormattedNumberInput.displayName = 'FormattedNumberInput';
