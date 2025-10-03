import React from "react";
import { Deal } from "@/src/entities/deal";
import { OrderCard } from "@/src/entities/order";
import styles from "./OrdersList.module.scss";

interface OrdersListProps {
  deals: Deal[];
  creatingId: string | null;
  onRepeatOrder: (deal: Deal) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  deals,
  creatingId,
  onRepeatOrder,
}) => {
  if (deals.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersGrid}>
      {deals.map((deal) => (
        <OrderCard
          key={deal.id}
          deal={deal}
          isCreating={creatingId === deal.id}
          onRepeatOrder={onRepeatOrder}
        />
      ))}
    </div>
  );
};
