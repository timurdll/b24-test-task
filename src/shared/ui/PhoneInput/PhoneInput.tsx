import React, { useState } from "react";
import Input from "@/src/shared/ui/Input/Input";
import { validatePhone } from "@/src/shared/lib/validation/fieldValidators";

interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showErrorOnBlur?: boolean;
  className?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label = "Телефон",
  placeholder = "Телефон",
  value,
  onChange,
  showErrorOnBlur = true,
  className = "",
  required = false,
}) => {
  const [hasBlurred, setHasBlurred] = useState(false);

  const error = validatePhone(value);
  const shouldShowError = showErrorOnBlur ? hasBlurred && error : error;

  const handleBlur = () => {
    setHasBlurred(true);
  };

  return (
    <div className={className}>
      <Input
        label={label}
        placeholder={placeholder}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        error={shouldShowError ? error?.message : null}
        showErrorOnBlur={showErrorOnBlur}
      />
    </div>
  );
};

export { PhoneInput };
