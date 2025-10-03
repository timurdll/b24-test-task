import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@/src/shared/api";
import Image from "next/image";
import styles from "./ProfileWidget.module.scss";

interface UserData {
  id: number;
  login: string;
  email: string;
  bitrixId: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

const ProfileWidget: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getCurrentUser();
        if (result.ok && result.user) {
          setUserData(result.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getAvatarIcon = () => {
    return (
      <Image
        src="/icons/avatar.svg"
        alt="Avatar"
        width={40}
        height={48}
        className={styles.avatarIcon}
      />
    );
  };

  // Получаем данные из userData или используем значения по умолчанию
  const displayName = userData?.login || "Не указано";
  const displayEmail = userData?.email || "Не указано";
  const displayPhone = userData?.phone || "Не указано";
  const displayAddress = userData?.address || "";

  if (loading) {
    return (
      <div className={styles.profileBlock}>
        <div className={styles.title}>
          <div className={styles.titleBar}></div>
          Профиль
        </div>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.profileBlock}>
      <div className={styles.title}>
        <div className={styles.titleBar}></div>
        Профиль
      </div>

      <div className={styles.profileContent}>
        <div className={styles.avatar}>{getAvatarIcon()}</div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Имя</label>
            <div className={styles.fieldValue}>{displayName}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Email</label>
            <div className={styles.fieldValue}>{displayEmail}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Телефон</label>
            <div className={styles.fieldValue}>{displayPhone}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Адрес</label>
            <div
              className={`${styles.fieldValue} ${
                !displayAddress ? styles.empty : ""
              }`}
            >
              {displayAddress || "Адрес"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileWidget };
