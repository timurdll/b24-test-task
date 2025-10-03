import React, { useState } from "react";
import Image from "next/image";
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
      name: "Имя",
      email: "Почта@jourrapide.com",
      avatar: "И",
    },
    status: "unpaid",
    completed: 96,
    action: "Смотреть",
  },
  {
    id: 2,
    employee: {
      name: "Gregory Davis A",
      email: "gregorydavis@dayrep.com",
      avatar: "GD",
    },
    status: "paid",
    completed: 73,
    action: "Смотреть",
  },
  {
    id: 3,
    employee: {
      name: "Gregory Davis A",
      email: "gregorydavis@dayrep.com",
      avatar: "GD",
    },
    status: "paid",
    completed: 73,
    action: "Смотреть",
  },
];

const filterOptions = [
  { value: "all", label: "Все платежи за последнюю неделю" },
  { value: "today", label: "Сегодня" },
  { value: "week", label: "За неделю" },
  { value: "month", label: "За месяц" },
  { value: "year", label: "За год" },
];

const PaymentsWidget: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(
    "Все платежи за последнюю неделю"
  );

  const filters = [
    "Все платежи за последнюю неделю",
    "Все платежи за последний месяц",
    "Все платежи за последний год",
    "Все платежи",
  ];

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setDropdownOpen(false);
    console.log("Selected filter:", filter);
  };

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
            <span>{selectedFilter}</span>
            <span className="icon-chevron-down">▼</span>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {filters.map((filter) => (
                <div
                  key={filter}
                  className={`${styles.dropdownItem} ${
                    selectedFilter === filter ? styles.active : ""
                  }`}
                  onClick={() => handleFilterSelect(filter)}
                >
                  {filter}
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
        {mockPayments.map((payment) => (
          <div key={payment.id} className={styles.tableRow}>
            <div className={styles.employeeInfo}>
              <div className={styles.avatar}>
                <Image
                  src="/icons/avatar.svg"
                  alt="Avatar"
                  width={20}
                  height={24}
                  className={styles.avatarIcon}
                />
              </div>
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
