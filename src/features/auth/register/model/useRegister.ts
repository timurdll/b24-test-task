import { useState } from "react";
import { validateRegisterData } from "@/src/entities/user";

interface RegisterResult {
  ok: boolean;
  error?: string;
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    login: string,
    email: string,
    password: string
  ): Promise<RegisterResult> => {
    const validation = validateRegisterData(login, email, password);
    if (!validation.isValid) {
      setError(validation.error!);
      return { ok: false, error: validation.error };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, email, password }),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error);
        return { ok: false, error: data.error };
      }

      return { ok: true };
    } catch (err: any) {
      const errorMsg = err.message || "Ошибка при регистрации";
      setError(errorMsg);
      return { ok: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { register, loading, error, clearError };
}
