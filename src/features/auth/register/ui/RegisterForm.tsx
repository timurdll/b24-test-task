import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Input from "@/src/shared/ui/Input/Input";
import { register } from "@/src/shared/api";
import { useUserStore } from "@/src/entities/user";
import styles from "./RegisterForm.module.scss";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loginValid = login.trim().length > 0;
  const emailValid = EMAIL_REGEX.test(email);
  const passwordValid = PASSWORD_REGEX.test(password);
  const confirmValid = password === confirm && confirm.length > 0;

  const formValid = loginValid && emailValid && passwordValid && confirmValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!formValid) return;

    try {
      setLoading(true);
      const result = await register({ login, email, password });

      if (result.ok && result.user) {
        setUser(result.user);
        router.push("/dashboard");
      } else {
        setSubmitError(result.error || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError("Неизвестная ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        label="Логин"
        placeholder="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        error={!loginValid && login.length > 0 ? "Введите логин" : null}
        showErrorOnBlur
      />

      <Input
        label="Mail"
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

      <Input
        label="Повторите пароль"
        placeholder="Повторите пароль"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={
          !confirmValid && confirm.length > 0 ? "Пароли не совпадают" : null
        }
        showEye
        showErrorOnBlur
      />

      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <button
        type="submit"
        className={styles.submit}
        disabled={!formValid || loading}
      >
        {loading ? "Регистрация..." : "Отправить"}
      </button>

      <div className={styles.orBlock}>
        <div className={styles.hrWrap}>
          <hr className={styles.divider} />
          <span className={styles.orText}>или</span>
          <hr className={styles.divider} />
        </div>
        <Link href="/auth/login" className={styles.link}>
          Вход
        </Link>
      </div>
    </form>
  );
}
