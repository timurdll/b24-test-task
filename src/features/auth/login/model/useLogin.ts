import { useState } from "react";
import { validateLoginData } from "@/src/entities/user";

interface LoginResult {
  ok: boolean;
  error?: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    email: string,
    password: string,
    remember?: boolean
  ): Promise<LoginResult> => {
    const validation = validateLoginData(email, password);
    if (!validation.isValid) {
      setError(validation.error!);
      return { ok: false, error: validation.error };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error);
        return { ok: false, error: data.error };
      }

      return { ok: true };
    } catch (err: any) {
      const errorMsg = err.message || "Ошибка при входе";
      setError(errorMsg);
      return { ok: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { login, loading, error, clearError };
}
