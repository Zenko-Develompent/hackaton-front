'use client';

import { RegisterForm } from "@/widgets/auth/RegistrationForm";
import { AuthGuard } from "@/features/components/AuthGuard";

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/profile">
      <RegisterForm />
    </AuthGuard>
  );
}