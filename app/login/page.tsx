'use client';

import { AuthGuard } from "@/features/components/AuthGuard";
import { LoginForm } from "@/widgets/auth/LoginForm";

export default function LoginPage() {
  return (
    
    <AuthGuard requireAuth={false} redirectTo="/profile">
      <LoginForm />
    </AuthGuard>
  );
}
