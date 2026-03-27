'use client';

import { AuthGuard } from "@/features/components/AuthGuard";
import { LoginForm } from "@/widgets/auth/LoginForm";

document.title="Доки Доки | Страница входа"
export default function LoginPage() {
  return (
    
    <AuthGuard requireAuth={false}>
      <LoginForm />
    </AuthGuard>
  );
}
