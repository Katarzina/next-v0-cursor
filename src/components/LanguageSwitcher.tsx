'use client';

import React from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Locale, localeNames, localeFlags } from '@/locales';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{localeFlags[locale]} {localeNames[locale]}</span>
          <span className="sm:hidden">{localeFlags[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(localeNames) as Locale[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLocale(lang)}
            className={locale === lang ? 'bg-accent' : ''}
          >
            <span className="mr-2">{localeFlags[lang]}</span>
            {localeNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}