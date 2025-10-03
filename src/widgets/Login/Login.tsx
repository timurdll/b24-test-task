import React, { JSX, useState } from "react";
import { EmailInput, PasswordInput } from "@/src/shared/ui";
import {
  validateEmail,
  validatePassword,
} from "@/src/shared/lib/validation/fieldValidators";
import styles from "./Login.module.scss";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Валидация формы
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const formValid = !emailError && !passwordError;

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
                <EmailInput
                  label="Email"
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
