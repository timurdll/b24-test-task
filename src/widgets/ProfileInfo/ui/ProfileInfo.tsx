import React, { useState } from "react";
import {
  Avatar,
  ProfileTitle,
  NameInput,
  EmailInput,
  PhoneInput,
  Input,
  DisplayField,
} from "@/src/shared/ui";
import { useProfileData } from "@/src/shared/lib/profile";
import { validateAddress } from "@/src/shared/lib/validation/fieldValidators";
import styles from "./ProfileInfo.module.scss";

const ProfileInfo: React.FC = () => {
  const {
    userData,
    formData,
    loading,
    saving,
    saveError,
    validationErrors,
    updateFormData,
    saveProfile,
  } = useProfileData();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const result = await saveProfile();
    if (result.success) {
      setIsEditing(false);
    }
  };

  const addressError = validateAddress(formData.address);

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <ProfileTitle variant="large" />
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <ProfileTitle variant="large" />

      <div className={styles.profileContent}>
        <Avatar size="large" />

        <div
          className={`${styles.fields} ${isEditing ? styles.largeInputs : ""}`}
        >
          {isEditing ? (
            <>
              <NameInput
                label="Имя"
                placeholder="Введите имя"
                value={formData.name}
                onChange={(value) => updateFormData("name", value)}
                variant="profile"
              />

              <EmailInput
                label="Email"
                placeholder="Введите email"
                value={formData.email}
                onChange={(value) => updateFormData("email", value)}
              />

              <PhoneInput
                label="Телефон"
                placeholder="Введите телефон"
                value={formData.phone}
                onChange={(value) => updateFormData("phone", value)}
              />

              <Input
                label="Адрес"
                placeholder="Введите адрес"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                error={addressError?.message || null}
                showErrorOnBlur
              />
            </>
          ) : (
            <>
              <DisplayField
                label="Имя"
                value={formData.name}
                placeholder="Не указано"
                size="large"
              />

              <DisplayField
                label="Email"
                value={formData.email}
                placeholder="Не указано"
                size="large"
              />

              <DisplayField
                label="Телефон"
                value={formData.phone}
                placeholder="Не указано"
                size="large"
              />

              <DisplayField
                label="Адрес"
                value={formData.address}
                placeholder="Адрес"
                size="large"
              />
            </>
          )}

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
