'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar as NuiNavbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaChevronDown as DownIcon } from 'react-icons/fa';
import { FiMonitor as SystemIcon } from 'react-icons/fi';
import { GiConwayLifeGlider as ConwayIcon } from 'react-icons/gi';
import { IoMdMoon as NightIcon, IoMdSunny as LightIcon } from 'react-icons/io';
import { RiTimeZoneLine as TimezoneIcon } from 'react-icons/ri';
import { TbBrandFortnite as FortniteIcon } from 'react-icons/tb';

export const Navbar = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NuiNavbar position="static">
      <NavbarContent>
        <NavbarItem isActive={pathname == '/'}>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className={`cursor-pointer bg-transparent p-0 text-medium text-foreground antialiased transition-opacity tap-highlight-transparent hover:opacity-80 active:opacity-disabled data-[hover=true]:bg-transparent ${pathname.startsWith('/games') ? 'font-semibold' : ''}`}
                radius="sm"
                variant="flat"
                endContent={<DownIcon />}
              >
                Games
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="games"
            selectionMode="single"
            selectedKeys={
              pathname.startsWith('/games/conway') ? new Set(['conway']) : ''
            }
          >
            <DropdownItem
              key="conway"
              description="Zero-player cellular automation game."
              startContent={<ConwayIcon className="h-5 w-5" />}
              href="/games/conway"
              as={NextLink} // https://github.com/nextui-org/nextui/issues/2131
            >
              Game of Life
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className={`cursor-pointer bg-transparent p-0 text-medium text-foreground antialiased transition-opacity tap-highlight-transparent hover:opacity-80 active:opacity-disabled data-[hover=true]:bg-transparent ${pathname.startsWith('/tools') ? 'font-semibold' : ''}`}
                radius="sm"
                variant="flat"
                endContent={<DownIcon />}
              >
                Tools
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="tools"
            selectionMode="single"
            selectedKeys={
              pathname.startsWith('/tools/fortnite')
                ? new Set(['fortnite'])
                : pathname.startsWith('/tools/timezones')
                  ? new Set(['timezones'])
                  : ''
            }
          >
            <DropdownItem
              key="fortnite"
              startContent={<FortniteIcon className="h-5 w-5" />}
              href="/tools/fortnite"
              as={NextLink} // https://github.com/nextui-org/nextui/issues/2131
            >
              Fortnite Data
            </DropdownItem>

            <DropdownItem
              key="timezones"
              startContent={<TimezoneIcon className="h-5 w-5" />}
              href="/tools/timezones"
              as={NextLink} // https://github.com/nextui-org/nextui/issues/2131
            >
              Timezone Convertor
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {mounted && (
        <NavbarContent justify="end">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  {theme === 'system' && <SystemIcon />}
                  {theme === 'light' && <LightIcon />}
                  {theme === 'dark' && <NightIcon />}
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="theme"
              selectionMode="single"
              selectedKeys={theme ? new Set([theme]) : ''}
            >
              <DropdownItem
                key="light"
                startContent={<LightIcon />}
                onPress={() => setTheme('light')}
              >
                Light
              </DropdownItem>
              <DropdownItem
                key="dark"
                startContent={<NightIcon />}
                onPress={() => setTheme('dark')}
              >
                Night
              </DropdownItem>
              <DropdownItem
                key="system"
                startContent={<SystemIcon />}
                onPress={() => setTheme('system')}
              >
                System
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
    </NuiNavbar>
  );
};
