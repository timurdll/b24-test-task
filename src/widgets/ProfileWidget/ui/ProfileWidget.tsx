import React from "react";
import { Avatar, ProfileTitle, DisplayField } from "@/src/shared/ui";
import { useProfileData } from "@/src/shared/lib/profile";
import styles from "./ProfileWidget.module.scss";

const ProfileWidget: React.FC = () => {
  const { userData, loading } = useProfileData();

  if (loading) {
    return (
      <div className={styles.profileBlock}>
        <ProfileTitle />
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.profileBlock}>
      <ProfileTitle />

      <div className={styles.profileContent}>
        <Avatar size="medium" />

        <div className={styles.fields}>
          <DisplayField
            label="Имя"
            value={userData?.login || ""}
            placeholder="Не указано"
            size="small"
          />

          <DisplayField
            label="Email"
            value={userData?.email || ""}
            placeholder="Не указано"
            size="small"
          />

          <DisplayField
            label="Телефон"
            value={userData?.phone || ""}
            placeholder="Не указано"
            size="small"
          />

          <DisplayField
            label="Адрес"
            value={userData?.address || ""}
            placeholder="Адрес"
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export { ProfileWidget };
