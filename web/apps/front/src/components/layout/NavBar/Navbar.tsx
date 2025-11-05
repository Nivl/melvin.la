'use client';

import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Link } from '@heroui/link';
import { Navbar as NuiNavbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import { usePathname } from 'next/navigation';
import { ReactNode, useSyncExternalStore } from 'react';
import { FaChevronDown as DownIcon } from 'react-icons/fa';
import { FaRegCalendar as TimestampIcon } from 'react-icons/fa6';
import { GiConwayLifeGlider as ConwayIcon } from 'react-icons/gi';
import { GiPerspectiveDiceSixFacesRandom as UuidIcon } from 'react-icons/gi';
import { RiTimeZoneLine as TimezoneIcon } from 'react-icons/ri';
import { TbBrandFortnite as FortniteIcon } from 'react-icons/tb';

import { ThemeSwitcher } from './ThemeSwitcher';

type Item = {
  key: string;
  label: string;
  path: string;
  description?: string;
  logo: ReactNode;
};

const tools: Item[] = [
  {
    key: 'fortnite',
    label: 'Fortnite Data',
    path: '/fortnite',
    logo: <FortniteIcon className="h-5 w-5" />,
  },
  {
    key: 'timezones',
    label: 'Timezone Converter',
    path: '/timezones',
    logo: <TimezoneIcon className="h-5 w-5" />,
  },
  {
    key: 'timestamp',
    label: 'Timestamp Lookup',
    path: '/timestamp',
    logo: <TimestampIcon className="h-5 w-5" />,
  },
  {
    key: 'uuid',
    label: 'UUID generator',
    path: '/uuid',
    logo: <UuidIcon className="h-5 w-5" />,
  },
];

const games: Item[] = [
  {
    key: 'conway',
    label: 'Game of Life',
    path: '/conway',
    logo: <ConwayIcon className="h-5 w-5" />,
  },
];

const emptySubscribe = () => () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const Navbar = () => {
  const pathname = usePathname();

  // This is used to display data that can only be rendered
  // client-side, such as the theme picker.
  const didMount = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <NuiNavbar position="static">
      <NavbarContent>
        <NavbarItem isActive={pathname == '/'}>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>

        <NavbarItem isActive={pathname == '/blog'}>
          <Link color="foreground" href="/blog">
            Blog
          </Link>
        </NavbarItem>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent ${pathname.startsWith('/games') ? 'font-semibold' : ''}`}
                radius="sm"
                variant="light"
                endContent={
                  <DownIcon
                    className={
                      'ease-spring-soft transition duration-700 group-aria-expanded:-rotate-180 motion-reduce:transition-none ' +
                      (pathname.startsWith('/games') ? '' : 'opacity-70')
                    }
                  />
                }
              >
                Games
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="games"
            variant="flat"
            items={games}
            selectedKeys={
              pathname.startsWith('/games')
                ? new Set([pathname.split('/')[2] ?? ''])
                : ''
            }
          >
            {item => (
              <DropdownItem
                key={item.key}
                startContent={item.logo}
                href={`/games/${item.path}`}
              >
                {item.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent ${pathname.startsWith('/tools') ? 'font-semibold' : ''}`}
                radius="sm"
                variant="light"
                endContent={
                  <DownIcon
                    className={
                      'ease-spring-soft transition duration-700 group-aria-expanded:-rotate-180 motion-reduce:transition-none ' +
                      (pathname.startsWith('/tools') ? '' : 'opacity-70')
                    }
                  />
                }
              >
                Tools
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="tools"
            variant="flat"
            items={tools}
            selectedKeys={
              pathname.startsWith('/tools')
                ? new Set([pathname.split('/')[2] ?? ''])
                : ''
            }
          >
            {item => (
              <DropdownItem
                key={item.key}
                startContent={item.logo}
                href={`/tools/${item.path}`}
              >
                {item.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {didMount && <ThemeSwitcher />}
    </NuiNavbar>
  );
};
