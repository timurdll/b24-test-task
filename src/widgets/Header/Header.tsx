import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUserStore } from "@/src/entities/user";
import styles from "./Header.module.scss";
import Image from "next/image";

const Header: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const navItems = [
    { href: "/dashboard", label: "Дашборд", icon: "/icons/dashboard.svg" },
    { href: "/profile", label: "Профиль", icon: "/icons/profile.svg" },
    { href: "/orders", label: "Заказы", icon: "/icons/orders.svg" },
    { href: "/payments", label: "Платежи", icon: "/icons/payments.svg" },
    { href: "", label: "Трансляция", icon: "/icons/broadcast.svg" },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              router.pathname === item.href ? styles.active : ""
            }`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={20}
              height={20}
              className={styles.icon}
            />
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
