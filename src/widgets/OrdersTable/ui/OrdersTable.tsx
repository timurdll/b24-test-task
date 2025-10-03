import React, { useState, useEffect } from "react";
import { getDeals, createDeal, Deal } from "@/src/shared/api";
import styles from "./OrdersTable.module.scss";

const OrdersTable: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const result = await getDeals();

        if (result.ok && result.deals) {
          setDeals(result.deals);
        } else {
          setError(result.error || "Ошибка загрузки заказов");
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
        setError("Ошибка загрузки заказов");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleRepeatOrder = async (deal: Deal) => {
    try {
      setCreating(deal.id);

      const result = await createDeal({
        title: deal.title,
        comments: `Повтор заказа от ${deal.date}. ${deal.comments}`,
      });

      if (result.ok) {
        // Обновляем список сделок
        const updatedResult = await getDeals();
        if (updatedResult.ok && updatedResult.deals) {
          setDeals(updatedResult.deals);
        }
        console.log("✅ Заказ успешно повторен");
      } else {
        console.error("Ошибка повторения заказа:", result.error);
        setError(result.error || "Ошибка повторения заказа");
      }
    } catch (err) {
      console.error("Error repeating order:", err);
      setError("Ошибка повторения заказа");
    } finally {
      setCreating(null);
    }
  };

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

      {deals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>У вас пока нет заказов</p>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {deals.map((deal) => (
            <div key={deal.id} className={styles.orderCard}>
              <div className={styles.statusContainer}>
                <div className={styles.statusDot}></div>
                <span className={styles.statusText}>{deal.status}</span>
              </div>
              <div className={styles.serviceDetails}>{deal.title}</div>
              <div className={styles.orderDate}>{deal.date}</div>
              {deal.comments && (
                <div className={styles.comments}>{deal.comments}</div>
              )}
              <button
                className={styles.repeatBtn}
                onClick={() => handleRepeatOrder(deal)}
                disabled={creating === deal.id}
              >
                {creating === deal.id ? "Создание..." : "Повторить заказ"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { OrdersTable };
