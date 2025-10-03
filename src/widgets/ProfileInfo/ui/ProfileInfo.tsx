import React, { useState, useEffect } from "react";
import { useUserStore } from "@/src/entities/user";
import { getCurrentUser, updateProfile } from "@/src/shared/api";
import Image from "next/image";
import styles from "./ProfileInfo.module.scss";

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

const ProfileInfo: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getCurrentUser();
        if (result.ok && result.user) {
          setUserData(result.user);
          setFormData((prev) => ({
            ...prev,
            name: result.user!.login,
            email: result.user!.email,
            phone: result.user!.phone || "",
            address: result.user!.address || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const result = await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });

      if (result.ok && result.user) {
        setUserData(result.user);
        setIsEditing(false);
        console.log("✅ Профиль успешно обновлен");
      } else {
        setSaveError(result.error || "Ошибка сохранения профиля");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError("Ошибка сохранения профиля");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getAvatarIcon = () => {
    return (
      <Image
        src="/icons/avatar.svg"
        alt="Avatar"
        width={60}
        height={72}
        className={styles.avatarIcon}
      />
    );
  };

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.title}>
          <div className={styles.titleBar}></div>
          Профиль
        </div>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.title}>
        <div className={styles.titleBar}></div>
        Профиль
      </div>

      <div className={styles.profileContent}>
        <div className={styles.avatar}>{getAvatarIcon()}</div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Имя</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={styles.fieldValue}
                style={{ background: "white", border: "1px solid #ccc" }}
              />
            ) : (
              <div className={styles.fieldValue}>
                {formData.name || "Не указано"}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={styles.fieldValue}
                style={{ background: "white", border: "1px solid #ccc" }}
              />
            ) : (
              <div className={styles.fieldValue}>
                {formData.email || "Не указано"}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Телефон</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={styles.fieldValue}
                style={{ background: "white", border: "1px solid #ccc" }}
              />
            ) : (
              <div className={styles.fieldValue}>
                {formData.phone || "Не указано"}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Адрес</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={styles.fieldValue}
                style={{
                  background: "white",
                  border: "1px solid #ccc",
                  height: "28px",
                }}
                placeholder="Введите адрес"
              />
            ) : (
              <div
                className={`${styles.fieldValue} ${
                  !formData.address ? styles.empty : ""
                }`}
              >
                {formData.address || "Адрес"}
              </div>
            )}
          </div>
          {saveError && <div className={styles.saveError}>{saveError}</div>}

          <button
            className={styles.editBtn}
            onClick={isEditing ? handleSave : handleEdit}
            disabled={saving}
          >
            {saving
              ? "Сохранение..."
              : isEditing
              ? "Сохранить"
              : "Редактировать"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProfileInfo };
