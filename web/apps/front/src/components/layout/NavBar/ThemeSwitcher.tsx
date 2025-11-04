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

import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
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
              onMouseEnter={() => {
                if (!reducedMotion) {
                  setIsBooped(true);
                }
              }}
            >
              <span
                className={`boop-animation ${isBooped ? 'rotate-15' : 'rotate-0'}`}
              >
                {theme === 'system' && <SystemThemeIcon width={20} />}
                {theme === 'light' && <LightThemeIcon width={20} />}
                {theme === 'dark' && <DarkThemeIcon width={20} />}
              </span>
            </Button>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
          aria-label="theme"
          variant="flat"
          selectedKeys={theme ? new Set([theme]) : ''}
        >
          <DropdownItem
            key="light"
            startContent={<LightThemeIcon width={20} />}
            onPress={() => {
              setTheme('light');
            }}
          >
            Light
          </DropdownItem>
          <DropdownItem
            key="dark"
            startContent={<DarkThemeIcon width={20} />}
            onPress={() => {
              setTheme('dark');
            }}
          >
            Night
          </DropdownItem>
          <DropdownItem
            key="system"
            startContent={<SystemThemeIcon width={20} />}
            onPress={() => {
              setTheme('system');
            }}
          >
            System
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};
