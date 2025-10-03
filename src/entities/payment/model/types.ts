/**
 * Типы для сущности Payment
 */

export interface Payment {
  id: number;
  employee: {
    name: string;
    email: string;
    avatar: string;
  };
  status: "paid" | "unpaid";
  completed: number;
  action: string;
}
