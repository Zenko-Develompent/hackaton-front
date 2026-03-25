'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/entities/auth/api/auth.api';
import { useAuth } from '@/features/auth/useAuth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const  data  = await authApi.login({
        email: identifier.includes('@') ? identifier : undefined,
        username: !identifier.includes('@') ? identifier : undefined,
        password,
      });

      await login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      router.push('/profile');
    } catch (e) {
      setError('Неверные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Вход</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Email или username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </Button>
      </CardContent>
    </Card>
  );
};
