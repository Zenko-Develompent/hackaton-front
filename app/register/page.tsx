'use client';

import { RegisterForm } from "@/widgets/auth/RegistrationForm";
import { AuthGuard } from "@/features/components/AuthGuard";
document.title="Доки Доки | Регистрация";
export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <RegisterForm />
    </AuthGuard>
  );
}