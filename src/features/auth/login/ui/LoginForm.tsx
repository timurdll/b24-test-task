import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Input from "@/src/shared/ui/Input/Input";
import { login } from "@/src/shared/api";
import { useUserStore } from "@/src/entities/user";
import styles from "./LoginForm.module.scss";

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

export default function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const emailValid = EMAIL_REGEX.test(email);
  const passwordValid = PASSWORD_REGEX.test(password);
  const formValid = emailValid && passwordValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!formValid) return;

    try {
      setLoading(true);
      const result = await login({ email, password, remember });

      if (result.ok && result.user) {
        setUser(result.user);
        router.push("/dashboard");
      } else {
        setSubmitError(result.error || "Ошибка входа");
      }
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError("Неизвестная ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        label="Email"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!emailValid && email.length > 0 ? "Неверный email" : null}
        showErrorOnBlur
      />

      <Input
        label="Пароль"
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={
          !passwordValid && password.length > 0
            ? "Минимум 6 символов, 1 заглавная буква, 1 цифра"
            : null
        }
        showEye
        showErrorOnBlur
      />

      <div className={styles.row}>
        <label className={styles.checkboxWrap}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Запомнить меня</span>
        </label>

        <Link href="/auth/forgot" className={styles.forgotLink}>
          Забыли пароль?
        </Link>
      </div>

      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <button
        type="submit"
        className={styles.submit}
        disabled={!formValid || loading}
      >
        {loading ? "Вход..." : "Войти"}
      </button>

      <div className={styles.orBlock}>
        <div className={styles.hrWrap}>
          <hr className={styles.divider} />
          <span className={styles.orText}>или</span>
          <hr className={styles.divider} />
        </div>
        <Link href="/auth/register" className={styles.link}>
          Регистрация
        </Link>
      </div>
    </form>
  );
}
