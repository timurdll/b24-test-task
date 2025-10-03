import { useState, useEffect } from "react";
import { dealApi } from "@/src/entities/deal";
import { Deal } from "@/src/entities/deal";

export function useOrders() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dealApi.getDeals();

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

  const handleRepeatOrder = async (deal: Deal) => {
    try {
      setCreating(deal.id);
      setError(null);

      const result = await dealApi.createDeal({
        title: deal.title,
        comments: `Повтор заказа от ${deal.date}. ${deal.comments}`,
      });

      if (result.ok) {
        // Обновляем список сделок
        await fetchDeals();
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

  useEffect(() => {
    fetchDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    creating,
    handleRepeatOrder,
    refetch: fetchDeals,
  };
}
