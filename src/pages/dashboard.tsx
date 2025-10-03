import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/src/entities/user";
import { getCurrentUser } from "@/src/shared/api";
import Header from "@/src/widgets/Header/Header";
import { OrdersWidget } from "@/src/widgets/OrdersWidget";
import { ProfileWidget } from "@/src/widgets/ProfileWidget";
import { BroadcastWidget } from "@/src/widgets/BroadcastWidget";
import { PaymentsWidget } from "@/src/widgets/PaymentsWidget";
import styles from "./dashboard.module.scss";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        const result = await getCurrentUser();
        if (result.ok && result.user) {
          setUser(result.user);
        } else {
          router.push("/auth/login");
        }
      }
    };

    checkAuth();
  }, [user, setUser, router]);

  if (!user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.welcome}>
            <h1 className={styles.welcomeTitle}>Привет, {user.login} 👋</h1>
          </div>

          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <OrdersWidget />
            </div>

            <div className={styles.gridItem}>
              <ProfileWidget />
            </div>

            <div className={styles.gridItem}>
              <BroadcastWidget />
            </div>

            <div className={styles.gridItem}>
              <PaymentsWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
