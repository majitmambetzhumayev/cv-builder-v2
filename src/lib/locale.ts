/**
 * Resolves a bilingual Sanity field to the correct locale string.
 * Falls back to the other locale if the requested one is missing.
 */
export function t(
  field: { en?: string; fr?: string } | null | undefined,
  locale: string,
  fallback = ''
): string {
  if (!field) return fallback
  const value = field[locale as 'en' | 'fr']
  if (value) return value
  // fallback to other locale
  return field.en ?? field.fr ?? fallback
}

