import { useState, useEffect } from "react";
import { getCurrentUser, updateProfile } from "@/src/shared/api";
import { useUserStore } from "@/src/entities/user";
import {
  validateProfileForm,
  ValidationError,
} from "@/src/shared/lib/validation";

export interface UserData {
  id: number;
  login: string;
  email: string;
  bitrixId: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const useProfileData = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const [formData, setFormData] = useState<ProfileFormData>({
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
          updateUser(result.user);
          setFormData({
            name: result.user.login,
            email: result.user.email,
            phone: result.user.phone || "",
            address: result.user.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setFormData({
        name: user.login,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
      setLoading(false);
    }
  }, [user, updateUser]);

  const updateFormData = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Очищаем ошибки валидации при изменении поля
    setValidationErrors((prev) =>
      prev.filter((error) => error.field !== field)
    );
  };

  const validateForm = () => {
    const validation = validateProfileForm(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    setValidationErrors([]);

    // Валидация формы
    if (!validateForm()) {
      setSaving(false);
      return { success: false, error: "Пожалуйста, исправьте ошибки в форме" };
    }

    try {
      const result = await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });

      if (result.ok && result.user) {
        updateUser(result.user);
        console.log("✅ Профиль успешно обновлен");
        return { success: true };
      } else {
        setSaveError(result.error || "Ошибка сохранения профиля");
        return {
          success: false,
          error: result.error || "Ошибка сохранения профиля",
        };
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError("Ошибка сохранения профиля");
      return { success: false, error: "Ошибка сохранения профиля" };
    } finally {
      setSaving(false);
    }
  };

  return {
    userData: user,
    formData,
    loading,
    saving,
    saveError,
    validationErrors,
    updateFormData,
    saveProfile,
    validateForm,
  };
};
