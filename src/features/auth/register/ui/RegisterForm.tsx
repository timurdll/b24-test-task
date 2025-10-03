import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NameInput, EmailInput, PasswordInput } from "@/src/shared/ui";
import { register } from "@/src/shared/api";
import { useUserStore } from "@/src/entities/user";
import { validatePasswordConfirm } from "@/src/shared/lib/validation/fieldValidators";
import styles from "./RegisterForm.module.scss";

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Валидация формы
  const nameError =
    name.trim().length === 0 ? { field: "name", message: "Введите имя" } : null;
  const emailError =
    email.trim().length === 0
      ? { field: "email", message: "Введите email" }
      : null;
  const passwordError =
    password.length === 0
      ? { field: "password", message: "Введите пароль" }
      : null;
  const confirmError = validatePasswordConfirm(password, confirm);

  const formValid =
    !nameError && !emailError && !passwordError && !confirmError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!formValid) return;

    try {
      setLoading(true);
      const result = await register({ name, email, password });

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
      <NameInput
        label="Имя"
        placeholder="Имя"
        value={name}
        onChange={setName}
        variant="registration"
      />

      <EmailInput
        label="Mail"
        placeholder="Email"
        value={email}
        onChange={setEmail}
      />

      <PasswordInput
        label="Пароль"
        placeholder="Пароль"
        value={password}
        onChange={setPassword}
      />

      <PasswordInput
        label="Повторите пароль"
        placeholder="Повторите пароль"
        value={confirm}
        onChange={setConfirm}
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
