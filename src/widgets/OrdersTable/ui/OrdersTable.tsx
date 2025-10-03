import React from "react";
import { useOrders, OrdersList } from "@/src/features/orders";
import styles from "./OrdersTable.module.scss";

const OrdersTable: React.FC = () => {
  const { deals, loading, error, creating, handleRepeatOrder } = useOrders();

  if (loading) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.title}>
          <div className={styles.titleBar}></div>
          Заказы
        </div>
        <div className={styles.loading}>Загрузка заказов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.title}>
          <div className={styles.titleBar}></div>
          Заказы
        </div>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.title}>
        <div className={styles.titleBar}></div>
        Заказы
      </div>

      <OrdersList
        deals={deals}
        creatingId={creating}
        onRepeatOrder={handleRepeatOrder}
      />
    </div>
  );
};

export { OrdersTable };
