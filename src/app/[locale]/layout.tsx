// app/[locale]/layout.tsx
import { Inter, Fraunces } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import "@/app/globals.css";

const locales = routing.locales;

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}



export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen">{children}</div>
        </NextIntlClientProvider>

        {/* Umami Analytics - Production only */}
        {/* {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="d40ce924-8416-4320-bf60-9c8c3af02963"
            strategy="afterInteractive"
          />
        )} */}
      </body>
    </html>
  );
}
