import React, { useState } from "react";
import Input from "@/src/shared/ui/Input/Input";
import { validatePassword } from "@/src/shared/lib/validation/fieldValidators";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showErrorOnBlur?: boolean;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label = "Пароль",
  placeholder = "Пароль",
  value,
  onChange,
  showErrorOnBlur = true,
  className = "",
}) => {
  const [hasBlurred, setHasBlurred] = useState(false);

  const error = validatePassword(value);
  const shouldShowError = showErrorOnBlur ? hasBlurred && error : error;

  const handleBlur = () => {
    setHasBlurred(true);
  };

  return (
    <div className={className}>
      <Input
        label={label}
        placeholder={placeholder}
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        error={shouldShowError ? error?.message : null}
        showEye
        showErrorOnBlur={showErrorOnBlur}
      />
    </div>
  );
};

export { PasswordInput };
