// app/[locale]/onboarding/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { PLATFORM_LOCALES } from '@/lib/cvLocales';
import { PROFESSIONS, INDUSTRIES } from '@/lib/professions';

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');
  const initial = PLATFORM_LOCALES.find(l => l.code === locale) ?? { code: locale, label: locale.toUpperCase() }
  const [cvLocales, setCvLocales] = useState([initial]);
  const [customCode, setCustomCode] = useState('');
  const [customLabel, setCustomLabel] = useState('');;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          industry,
          username,
          cvLocales: cvLocales
        }),
      });
      
      if (!response.ok) { 
        const errorData = await response.json();
        setError(t(`error.${errorData.error}`)  || t('error.GENERIC_ERROR'));
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (error) {
      setError(t('error.GENERIC_ERROR'));
    } finally {
      setLoading(false);
    }
  }

  const handleAddCustomLocale = () => {
    if (!/^[a-z]{2}$/.test(customCode.toLowerCase())) return  // format check
    if (cvLocales.some(l => l.code === customCode.toLowerCase())) return   // duplicate check
    setCvLocales(prev => [...prev, {code: customCode.toLowerCase(), label: customLabel}])
    setCustomCode('')
    setCustomLabel('')
  }

  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }
    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      const result = await fetch(`/api/auth/check-username?username=${username}`)
      const data = await result.json();
      if (data.available) {
        setUsernameStatus('available');
        setUsernameMessage(t('error.USERNAME_AVAILABLE', { username } ));
      } else {
        setUsernameStatus('taken');
        setUsernameMessage(t('error.USERNAME_TAKEN'));
      }
    }, 500)
    return () => clearTimeout(timer);
  }, [username, t])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-gradient-platform mb-2">{t('title')}</h1>
          <p className="text-neutral-400">{t('subtitle')}</p>
        </div>

        <div className="glass-card p-8 space-y-6">

          {/* job title and industry form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('job-title')}
              </label>
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                list="professions-list"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition"
                placeholder="web developer, product manager, etc."
                value = {jobTitle}
                onChange={e => {setJobTitle(e.target.value)
                  const match = PROFESSIONS.find(p => p.label === e.target.value)
                  if (match) setIndustry(match.industry)
                  } // auto-fill industry based on profession
                }
              />
              <datalist id="professions-list">
                {PROFESSIONS.map((profession) => (
                  <option key={profession.label} value={profession.label} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('industry')}
              </label>
              <input
                id="industry"
                name="industry"
                list="industries-list"
                type="text"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition"
                placeholder="Software Development"
                value = {industry}
                onChange={e => setIndustry(e.target.value)}
              />
              <datalist id="industries-list">
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition"
                placeholder="linus_torvalds_dev"
              />
              {usernameMessage && (
                <p 
                className={usernameStatus === 'available' ? 'text-green-400' : 'text-red-400'}>
                  {usernameMessage}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cvLocales" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('cv-languages')}
              </label>
              <select 
              onChange={e => {
                const found = PLATFORM_LOCALES.find(item => item.code === e.target.value)
                if (found) setCvLocales(prev => [...prev, found])
                e.target.value = ''// reset after selection
              }}>
                <option value="">{t('select-language')}</option>
                {PLATFORM_LOCALES.filter(l => !cvLocales.some(c => c.code === l.code))
                .map(({ code, label }) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
              {cvLocales.map(({ code, label }) => (
                <span key={code}>
                  {label}
                  <button type="button" onClick={() =>
                    setCvLocales(prev => prev.filter(l => l.code !== code))
                  }>×</button>
                </span>
              ))}
            </div>
            <div>
              <label htmlFor="customCvLocales" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('custom-cv-locales')}
              </label>
              <input value={customCode} onChange={e => setCustomCode(e.target.value)} />
              <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} />
              <button type="button" onClick={handleAddCustomLocale}>Add</button>
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
              {loading ? t('loading') : t('continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
