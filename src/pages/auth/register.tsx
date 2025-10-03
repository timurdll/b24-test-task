import React from "react";
import { RegisterForm } from "@/src/features/auth/register";
import { AuthLayout } from "@/src/app/layouts/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout title="Регистрация">
      <RegisterForm />
    </AuthLayout>
  );
}
