import React from "react";
import { Deal } from "@/src/entities/deal";
import styles from "./OrderCard.module.scss";

interface OrderCardProps {
  deal: Deal;
  isCreating: boolean;
  onRepeatOrder: (deal: Deal) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  deal,
  isCreating,
  onRepeatOrder,
}) => {
  return (
    <div className={styles.orderCard}>
      <div className={styles.statusContainer}>
        <div className={styles.statusDot}></div>
        <span className={styles.statusText}>{deal.status}</span>
      </div>
      <div className={styles.serviceDetails}>{deal.title}</div>
      <div className={styles.orderDate}>{deal.date}</div>
      <button
        className={styles.repeatBtn}
        onClick={() => onRepeatOrder(deal)}
        disabled={isCreating}
      >
        {isCreating ? "Создание..." : "Повторить заказ"}
      </button>
    </div>
  );
};
