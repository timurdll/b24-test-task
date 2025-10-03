import React, { useState } from "react";
import Input from "@/src/shared/ui/Input/Input";
import { validateEmail } from "@/src/shared/lib/validation/fieldValidators";

interface EmailInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showErrorOnBlur?: boolean;
  className?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
  label = "Email",
  placeholder = "Email",
  value,
  onChange,
  showErrorOnBlur = true,
  className = "",
}) => {
  const [hasBlurred, setHasBlurred] = useState(false);

  const error = validateEmail(value);
  const shouldShowError = showErrorOnBlur ? hasBlurred && error : error;

  const handleBlur = () => {
    setHasBlurred(true);
  };

  return (
    <div className={className}>
      <Input
        label={label}
        placeholder={placeholder}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        error={shouldShowError ? error?.message : null}
        showErrorOnBlur={showErrorOnBlur}
      />
    </div>
  );
};

export { EmailInput };
