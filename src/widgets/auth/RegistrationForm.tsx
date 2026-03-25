'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/entities/auth/api/auth.api';
import { useAuth } from '@/features/auth/useAuth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { log } from 'console';

export const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needVerification, setNeedVerification] = useState(false);
  const [verificationTicket, setVerificationTicket] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const handleSubmit = async () => {
    // Валидация
    if (!username.trim()) {
      setError('Введите username');
      return;
    }

    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    if (!password) {
      setError('Введите пароль');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      if (data.needVerify) {
        // Требуется подтверждение email
        setNeedVerification(true);
        setVerificationTicket(data.ticket);
        setResendTimer(data.resendAfterSec);
        
        // Запускаем таймер для повторной отправки
        if (data.resendAfterSec > 0) {
          let timer = data.resendAfterSec;
          const interval = setInterval(() => {
            timer--;
            setResendTimer(timer);
            if (timer <= 0) {
              clearInterval(interval);
            }
          }, 1000);
        }
      } else {
        // Если верификация не требуется, сразу логиним
        // В реальном приложении здесь может быть автоматический вход
        // или перенаправление на страницу входа
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      if (err.message?.includes('username already exists')) {
        setError('Пользователь с таким username уже существует');
      } else if (err.message?.includes('email already exists')) {
        setError('Пользователь с таким email уже существует');
      } else {
        setError('Ошибка регистрации. Попробуйте позже.');
        console.log('Registration error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      // Здесь должен быть API запрос на повторную отправку письма
      // const response = await authApi.resendVerification({ ticket: verificationTicket });
      // setResendTimer(response.resendAfterSec);
      
      // Заглушка:
      setResendTimer(60);
      let timer = 60;
      const interval = setInterval(() => {
        timer--;
        setResendTimer(timer);
        if (timer <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    } catch (err) {
      setError('Не удалось отправить письмо повторно');
    } finally {
      setLoading(false);
    }
  };

  // Если требуется подтверждение email, показываем форму верификации
  if (needVerification) {
    return (
      <Card className="w-full max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>Подтверждение email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <p className="text-gray-600">
              Мы отправили письмо для подтверждения на адрес:
            </p>
            <p className="font-semibold text-gray-900">{email}</p>
            <p className="text-sm text-gray-500">
              Пожалуйста, перейдите по ссылке в письме, чтобы активировать аккаунт
            </p>
          </div>

          {resendTimer > 0 ? (
            <p className="text-sm text-center text-gray-500">
              Отправить повторно через {resendTimer} сек
            </p>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
              disabled={loading}
            >
              Отправить письмо повторно
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Перейти к входу
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="Username *"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Только латинские буквы, цифры и знак подчеркивания
          </p>
        </div>

        <Input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Пароль *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Подтвердите пароль *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-500">Уже есть аккаунт?</span>{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            Войти
          </button>
        </div>
      </CardContent>
    </Card>
  );
};