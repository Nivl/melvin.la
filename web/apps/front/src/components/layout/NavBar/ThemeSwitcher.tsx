'use client';

import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { NavbarContent, NavbarItem } from '@heroui/navbar';
import {
  Moon as DarkThemeIcon,
  Palette as SystemThemeIcon,
  Sun as LightThemeIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { ThemeSwitcherIcon } from '#components/icons/ThemeSwitcherIcon.tsx';
import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';

export const ThemeSwitcher = () => {
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
    <NavbarContent justify="end">
      <Dropdown>
        <NavbarItem>
          <DropdownTrigger>
            <Button
              disableRipple
              className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent`}
              variant="light"
              isIconOnly
              aria-label="Switch theme"
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
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="theme"
          selectionMode="single"
          selectedKeys={theme ? new Set([theme]) : new Set(['light'])}
          variant="flat"
        >
          <DropdownItem
            key="light"
            startContent={<LightThemeIcon width={20} />}
            onPress={() => {
              setTheme('light');
              setAnimationFocus('themeChange');
            }}
          >
            Light
          </DropdownItem>
          <DropdownItem
            key="dark"
            startContent={<DarkThemeIcon width={20} />}
            onPress={() => {
              setTheme('dark');
              setAnimationFocus('themeChange');
            }}
          >
            Night
          </DropdownItem>
          <DropdownItem
            key="system"
            startContent={<SystemThemeIcon width={20} />}
            onPress={() => {
              setTheme('system');
              setAnimationFocus('themeChange');
            }}
          >
            System
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};
