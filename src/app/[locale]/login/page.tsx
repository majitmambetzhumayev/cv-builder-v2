// app/[locale]/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('login');
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('credential-error'));
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('login-error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-gradient-platform mb-2">{t('title')}</h1>
          <p className="text-neutral-400">{t('subtitle')}</p>
        </div>

        <div className="glass-card p-8 space-y-6">

          {/* Credentials form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('identifier')}
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="identifier"
                required
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition"
                placeholder="linus.torvalds@kernel.org"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-forest-600 hover:bg-forest-500 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : t('login')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-neutral-900/40 text-neutral-500">{t('or')}</span>
            </div>
          </div>

          {/* OAuth */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl: `/${locale}/dashboard` })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-medium rounded-lg transition"
            >
              {t('github')}
            </button>
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: `/${locale}/dashboard` })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-medium rounded-lg transition"
            >
              {t('google')}
            </button>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-neutral-400">
            {t('signup-prompt')}{' '}
            <Link href={`/${locale}/register`} className="text-forest-400 hover:text-forest-300 transition-colors">
              {t('signup-link')}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
