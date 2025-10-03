import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/src/entities/user";
import { getCurrentUser } from "@/src/shared/api";
import Header from "@/src/widgets/Header/Header";
import { OrdersTable } from "@/src/widgets/OrdersTable";
import styles from "./orders.module.scss";

const Orders: React.FC = () => {
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
    <div className={styles.orders}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <OrdersTable />
        </div>
      </main>
    </div>
  );
};

export default Orders;
