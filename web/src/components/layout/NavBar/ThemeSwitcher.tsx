'use client';

import { Button, Dropdown } from '@heroui/react';
import {
  Moon as DarkThemeIcon,
  Palette as SystemThemeIcon,
  Sun as LightThemeIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { ThemeSwitcherIcon } from '#components/icons/ThemeSwitcherIcon.tsx';
import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';

export const ThemeSwitcher = () => {
  const t = useTranslations('navbar');
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [animationFocus, setAnimationFocus] = useState<'boop' | 'themeChange'>(
    'boop',
  );
  const [isBooped, setIsBooped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsBooped(false);
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [isBooped]);

  return (
    <Dropdown>
      <Button
        className={`text-foreground tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 text-base antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent`}
        variant="ghost"
        isIconOnly
        aria-label={t('switchTheme')}
        onMouseEnter={() => {
          if (!reducedMotion) {
            setIsBooped(true);
            setAnimationFocus('boop');
          }
        }}
      >
        <span className={`text-amber-400`}>
          <ThemeSwitcherIcon
            theme={resolvedTheme as 'light' | 'dark'}
            animationFocus={animationFocus}
            width={24}
            height={24}
            isBooped={isBooped}
          />
        </span>
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label={t('theme')}
          selectionMode="single"
          selectedKeys={theme ? new Set([theme]) : new Set(['light'])}
          onAction={key => {
            const val = key.toString() as 'light' | 'dark' | 'system';
            setTheme(val);
            setAnimationFocus('themeChange');
          }}
        >
          <Dropdown.Item id="light" textValue={t('themeLight')}>
            <LightThemeIcon width={20} /> {t('themeLight')}
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          <Dropdown.Item id="dark" textValue={t('themeDark')}>
            <DarkThemeIcon width={20} /> {t('themeDark')}
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          <Dropdown.Item id="system" textValue={t('themeSystem')}>
            <SystemThemeIcon width={20} /> {t('themeSystem')}
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
