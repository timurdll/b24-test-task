import React, { JSX, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/src/shared/ui/Input/Input";
import styles from "./Login.module.scss";
// По соглашению — в processes лежат бизнес-логика / api

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

export default function Login(): JSX.Element {
  const router = useRouter();

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

    // если валидация на форме не прошла — пометим touched в input через showErrorOnBlur (уже сделано)
    if (!formValid) return;

    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2);
      // Пример вызова бизнес-логики (реализуй auth.service.login)
      // Предполагается что authService.login возвращает { ok: boolean, error?: string }
      //   const res = await authService.login({ email, password, remember });
      //   if (res?.ok) {
      //     // перенаправление после успешного логина
      //     router.push("/");
      //   } else {
      //     setSubmitError(res?.error ?? "Ошибка входа. Попробуйте ещё раз.");
      //   }
    } catch (err) {
      console.error(err);
      setSubmitError("Серверная ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.root}>
      <div className={styles.card}>
        <div className={styles.container}>
          <section className={styles.left}>
            <div className={styles.formInner}>
              <h1 className={styles.logo}>ЛОГОТИП</h1>
              <h2 className={styles.title}>Вход</h2>

              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <Input
                  label="Email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={
                    !emailValid && email.length > 0 ? "Неверный email" : null
                  }
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

                  <a className={styles.forgotLink} href="/auth/forgot">
                    Забыли пароль?
                  </a>
                </div>

                {submitError && (
                  <div className={styles.submitError}>{submitError}</div>
                )}

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
                  <a href="/auth/register" className={styles.loginLink}>
                    Регистрация
                  </a>
                </div>
              </form>
            </div>
          </section>

          <aside className={styles.right} aria-hidden="true" />
          <div className={styles.rightMobile}>
            <div className={styles.rightMobileInner} />
          </div>
        </div>
      </div>
    </main>
  );
}
