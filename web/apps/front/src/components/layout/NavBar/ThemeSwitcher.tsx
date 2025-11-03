import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { NavbarContent, NavbarItem } from '@heroui/navbar';
import { useTheme } from 'next-themes';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { FiMonitor as SystemIcon } from 'react-icons/fi';
import { IoMdMoon as NightIcon, IoMdSunny as LightIcon } from 'react-icons/io';

import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';

const emptySubscribe = () => () => { }; // eslint-disable-line @typescript-eslint/no-empty-function

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

  // This is used to display data that can only be rendered
  // client-side, such as the theme picker.
  const didMount = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!didMount) {
    return;
  }

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
                {theme === 'system' && <SystemIcon />}
                {theme === 'light' && <LightIcon />}
                {theme === 'dark' && <NightIcon />}
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
            startContent={<LightIcon />}
            onPress={() => {
              setTheme('light');
            }}
          >
            Light
          </DropdownItem>
          <DropdownItem
            key="dark"
            startContent={<NightIcon />}
            onPress={() => {
              setTheme('dark');
            }}
          >
            Night
          </DropdownItem>
          <DropdownItem
            key="system"
            startContent={<SystemIcon />}
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
