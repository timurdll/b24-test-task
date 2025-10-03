import React from "react";
import { LoginForm } from "@/src/features/auth/login";
import { AuthLayout } from "@/src/app/layouts/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Вход">
      <LoginForm />
    </AuthLayout>
  );
}
