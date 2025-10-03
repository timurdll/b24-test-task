import React from "react";
import styles from "./DisplayField.module.scss";

interface DisplayFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const DisplayField: React.FC<DisplayFieldProps> = ({
  label,
  value,
  placeholder = "Не указано",
  className = "",
  size = "medium",
}) => {
  const displayValue = value || placeholder;

  return (
    <div className={`${styles.displayField} ${styles[size]} ${className}`}>
      <label className={styles.label}>{label}</label>
      <div className={styles.value}>{displayValue}</div>
    </div>
  );
};

export { DisplayField };
