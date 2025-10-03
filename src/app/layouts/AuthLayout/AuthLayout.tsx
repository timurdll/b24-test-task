import React, { ReactNode } from "react";
import styles from "./AuthLayout.module.scss";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <main className={styles.root}>
      <div className={styles.card}>
        <div className={styles.container}>
          <section className={styles.left}>
            <div className={styles.formInner}>
              <h1 className={styles.logo}>ЛОГОТИП</h1>
              <h2 className={styles.title}>{title}</h2>
              {children}
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
