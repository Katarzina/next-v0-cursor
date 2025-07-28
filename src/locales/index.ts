import { en } from './en';
import { uk } from './uk';
import { cs } from './cs';

export const locales = {
  en,
  uk,
  cs
} as const;

export type Locale = keyof typeof locales;
export type TranslationKeys = typeof en;

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
  cs: 'Čeština'
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  uk: '🇺🇦',
  cs: '🇨🇿'
};