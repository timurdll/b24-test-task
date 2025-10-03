import React, { useState, useMemo } from "react";
import { Avatar } from "@/src/shared/ui";
import styles from "./PaymentsWidget.module.scss";

interface Payment {
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

const mockPayments: Payment[] = [
  {
    id: 1,
    employee: {
      name: "Иван Петров",
      email: "ivan@example.com",
      avatar: "ИП",
    },
    status: "unpaid",
    completed: 96,
    action: "Смотреть",
  },
  {
    id: 2,
    employee: {
      name: "Анна Сидорова",
      email: "anna@example.com",
      avatar: "АС",
    },
    status: "paid",
    completed: 100,
    action: "Смотреть",
  },
  {
    id: 3,
    employee: {
      name: "Михаил Козлов",
      email: "mikhail@example.com",
      avatar: "МК",
    },
    status: "unpaid",
    completed: 45,
    action: "Смотреть",
  },
  {
    id: 4,
    employee: {
      name: "Елена Волкова",
      email: "elena@example.com",
      avatar: "ЕВ",
    },
    status: "paid",
    completed: 100,
    action: "Смотреть",
  },
  {
    id: 5,
    employee: {
      name: "Дмитрий Новиков",
      email: "dmitry@example.com",
      avatar: "ДН",
    },
    status: "unpaid",
    completed: 78,
    action: "Смотреть",
  },
  {
    id: 6,
    employee: {
      name: "Ольга Морозова",
      email: "olga@example.com",
      avatar: "ОМ",
    },
    status: "paid",
    completed: 100,
    action: "Смотреть",
  },
];

type FilterType = "all" | "status" | "completion";
type StatusFilter = "all" | "paid" | "unpaid";
type CompletionFilter = "all" | "completed" | "incomplete";

interface FilterOption {
  value: string;
  label: string;
  type: FilterType;
  status?: StatusFilter;
  completion?: CompletionFilter;
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "Все платежи", type: "all" },
  { value: "paid", label: "Оплаченные", type: "status", status: "paid" },
  { value: "unpaid", label: "Неоплаченные", type: "status", status: "unpaid" },
  {
    value: "completed",
    label: "Выполненные (100%)",
    type: "completion",
    completion: "completed",
  },
  {
    value: "incomplete",
    label: "Невыполненные",
    type: "completion",
    completion: "incomplete",
  },
];

const PaymentsWidget: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(
    filterOptions[0]
  );

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setDropdownOpen(false);
  };

  // Мемоизированная фильтрация платежей
  const filteredPayments = useMemo(() => {
    return mockPayments.filter((payment) => {
      // Фильтр по статусу
      if (selectedFilter.type === "status" && selectedFilter.status) {
        if (selectedFilter.status === "all") return true;
        return payment.status === selectedFilter.status;
      }

      // Фильтр по выполнению
      if (selectedFilter.type === "completion" && selectedFilter.completion) {
        if (selectedFilter.completion === "all") return true;
        if (selectedFilter.completion === "completed") {
          return payment.completed === 100;
        }
        if (selectedFilter.completion === "incomplete") {
          return payment.completed < 100;
        }
      }

      // Показать все платежи
      return true;
    });
  }, [selectedFilter]);

  return (
    <div className={styles.paymentsBlock}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.titleBar}></div>
          Платежи
        </div>
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{selectedFilter.label}</span>
            <span className="icon-chevron-down">▼</span>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {filterOptions.map((filter) => (
                <div
                  key={filter.value}
                  className={`${styles.dropdownItem} ${
                    selectedFilter.value === filter.value ? styles.active : ""
                  }`}
                  onClick={() => handleFilterSelect(filter)}
                >
                  {filter.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.tableHeader}>
        <div className={`${styles.tableHeaderItem} ${styles.sortable}`}>
          Employee <span className="icon-arrow-up">↑</span>
        </div>
        <div className={styles.tableHeaderItem}>Статус</div>
        <div className={styles.tableHeaderItem}>Выполнено</div>
        <div className={styles.tableHeaderItem}>Действие</div>
      </div>

      <div className={styles.tableBody}>
        {filteredPayments.map((payment) => (
          <div key={payment.id} className={styles.tableRow}>
            <div className={styles.employeeInfo}>
              <Avatar size="small" />
              <div className={styles.employeeText}>
                <div className={styles.employeeName}>
                  {payment.employee.name}
                </div>
                <div className={styles.employeeEmail}>
                  {payment.employee.email}
                </div>
              </div>
            </div>
            <div className={`${styles.statusPill} ${styles[payment.status]}`}>
              <span className={styles.statusDot}></span>
              {payment.status === "unpaid" ? "Не оплачено" : "Оплачено"}
            </div>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${payment.completed}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{payment.completed}%</span>
            </div>
            <div>
              <a href="#" className={styles.actionLink}>
                {payment.action}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PaymentsWidget };
