import React, { useState } from "react";
import Input from "@/src/shared/ui/Input/Input";
import {
  validateNameForRegistration,
  validateNameForProfile,
} from "@/src/shared/lib/validation/fieldValidators";

interface NameInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: "registration" | "profile";
  showErrorOnBlur?: boolean;
  className?: string;
}

const NameInput: React.FC<NameInputProps> = ({
  label = "Имя",
  placeholder = "Имя",
  value,
  onChange,
  variant = "registration",
  showErrorOnBlur = true,
  className = "",
}) => {
  const [hasBlurred, setHasBlurred] = useState(false);

  const validateName =
    variant === "registration"
      ? validateNameForRegistration
      : validateNameForProfile;
  const error = validateName(value);
  const shouldShowError = showErrorOnBlur ? hasBlurred && error : error;

  const handleBlur = () => {
    setHasBlurred(true);
  };

  return (
    <div className={className}>
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        error={shouldShowError ? error?.message : null}
        showErrorOnBlur={showErrorOnBlur}
      />
    </div>
  );
};

export { NameInput };
