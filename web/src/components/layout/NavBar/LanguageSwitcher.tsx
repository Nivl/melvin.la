'use client';

import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { NavbarItem } from '@heroui/navbar';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LanguageSwitcherIcon } from '#components/icons/LanguageSwitcherIcon.tsx';
import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';
import { usePathname, useRouter } from '#i18n/routing';

type Language = {
  key: string;
  label: string;
};

const languages: Language[] = [
  {
    key: 'en',
    label: 'English',
  },
  {
    key: 'fr',
    label: 'Français',
  },
  {
    key: 'es',
    label: 'Español',
  },
  {
    key: 'ko',
    label: '한국어',
  },
  {
    key: 'zh',
    label: '中文 (简体)',
  },
  {
    key: 'zh-tw',
    label: '中文 (繁體)',
  },
];

export const LanguageSwitcher = () => {
  const t = useTranslations('navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isBooped, setIsBooped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsBooped(false);
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [isBooped]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent`}
            variant="light"
            isIconOnly
            aria-label={t('changeLanguage')}
            onMouseEnter={() => {
              if (!reducedMotion) {
                setIsBooped(true);
              }
            }}
          >
            <LanguageSwitcherIcon isBooped={isBooped} />
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label={t('language')}
        selectionMode="single"
        variant="flat"
        onAction={key => {
          router.push({ pathname }, { locale: key.toString() });
        }}
        selectedKeys={new Set([locale])}
      >
        {languages.map(lang => (
          <DropdownItem key={lang.key}>{lang.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
