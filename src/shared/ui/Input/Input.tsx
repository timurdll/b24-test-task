// src/shared/ui/Input/Input.tsx
import React, { InputHTMLAttributes, useId, useRef, useState } from "react";
import styles from "./Input.module.scss";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  error?: string | null;
  showEye?: boolean;
  showErrorOnBlur?: boolean;
};

export function Input({
  label,
  error = null,
  type = "text",
  id,
  showEye = false,
  showErrorOnBlur = true,
  onBlur,
  onFocus,
  ...rest
}: Props) {
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  const helperId = `${inputId}-helper`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [reveal, setReveal] = useState(false); // контролирует видимость пароля
  const [touched, setTouched] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (reveal ? "text" : "password") : type;

  const hasError = Boolean(error);
  const shouldShowError = hasError && (!showErrorOnBlur || touched);

  const eyeIcon = "/icons/eye.svg";
  const eyeOffIcon = "/icons/eyeOff.svg";
  const warningIcon = "/icons/warning.svg";

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    onFocus?.(e);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched(true);
    onBlur?.(e);
  }

  // переключаем reveal без потери каретки
  function toggleReveal() {
    const el = inputRef.current;
    if (!el) {
      setReveal((r) => !r);
      return;
    }

    // сохранить позицию выделения/курсор
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const wasFocused = document.activeElement === el;

    setReveal((prev) => {
      const next = !prev;

      // После обновления состояния — в следующем кадре восстановим позицию и фокус
      // requestAnimationFrame даёт достаточно ранний момент, чтобы браузер применил новый type
      requestAnimationFrame(() => {
        const cur = inputRef.current;
        if (!cur) return;

        try {
          // восстановим фокус, если был
          if (wasFocused) cur.focus();
          // восстановим позицию каретки/выделение
          if (typeof start === "number" && typeof end === "number") {
            // setSelectionRange может бросить в некоторых старых браузерах, поэтому обёртка в try/catch
            cur.setSelectionRange(start, end);
          }
        } catch {
          // silently ignore
        }
      });

      return next;
    });
  }

  const passwordIconSrc = reveal ? eyeOffIcon : eyeIcon;

  return (
    <label className={styles.inputWrap} htmlFor={inputId}>
      {label && <span className={styles.labelText}>{label}</span>}

      <div className={styles.inputRow}>
        <input
          id={inputId}
          ref={inputRef}
          className={`${styles.input} ${
            shouldShowError ? styles.inputError : ""
          }`}
          type={inputType}
          aria-invalid={shouldShowError}
          aria-describedby={shouldShowError ? helperId : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {isPassword && showEye ? (
          shouldShowError ? (
            <span
              className={styles.errorIcon}
              style={{ backgroundImage: `url(${warningIcon})` }}
              aria-hidden="true"
            />
          ) : (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={toggleReveal}
              onMouseDown={(e) => e.preventDefault()} // не снимает фокус с инпута при клике
              aria-label={reveal ? "Скрыть пароль" : "Показать пароль"}
            >
              <img src={passwordIconSrc} alt="" className={styles.icon} />
            </button>
          )
        ) : null}

        {!isPassword && shouldShowError ? (
          <span
            className={styles.errorIcon}
            style={{ backgroundImage: `url(${warningIcon})` }}
            aria-hidden="true"
          />
        ) : null}
      </div>

      {shouldShowError && (
        <div id={helperId} className={styles.helper}>
          {error}
        </div>
      )}
    </label>
  );
}

export default Input;
