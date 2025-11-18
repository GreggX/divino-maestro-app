'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema } from '@/lib/utils/validators';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Validate form data
    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: { name?: string; email?: string; password?: string } =
        {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'name' | 'email' | 'password'] =
            err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        // Handle validation errors
        if (result.errors && Array.isArray(result.errors)) {
          setErrors({ general: result.errors.join(', ') });
        } else {
          setErrors({ general: result.message || 'Registration failed' });
        }
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {errors.general}
        </div>
      )}

      <Input
        name="name"
        type="text"
        label="Name"
        placeholder="John Doe"
        error={errors.name}
        required
        autoComplete="name"
      />

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        error={errors.email}
        required
        autoComplete="email"
      />

      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        error={errors.password}
        required
        autoComplete="new-password"
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
