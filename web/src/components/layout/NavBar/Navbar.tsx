'use client';

import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Link } from '@heroui/link';
import {
  Navbar as NuiNavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar';
import { motion, MotionConfig } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ReactNode, useState, useSyncExternalStore } from 'react';
import { FaChevronDown as DownIcon } from 'react-icons/fa';
import { FaRegCalendar as TimestampIcon } from 'react-icons/fa6';
import {
  GiConwayLifeGlider as ConwayIcon,
  GiPerspectiveDiceSixFacesRandom as UuidIcon,
} from 'react-icons/gi';
import { MdOutlineTextFields as StringLengthIcon } from 'react-icons/md';
import { PiPathBold as PathfindingIcon } from 'react-icons/pi';
import { RiTimeZoneLine as TimezoneIcon } from 'react-icons/ri';
import { TbBrandFortnite as FortniteIcon } from 'react-icons/tb';

import { Link as NextLink, usePathname } from '#i18n/routing';

import { LanguageSwitcher } from './LanguageSwitcher';
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
    label: 'fortnite',
    path: 'fortnite',
    logo: <FortniteIcon className="h-5 w-5" />,
  },
  {
    key: 'string-length',
    label: 'string-length',
    path: 'string-length',
    logo: <StringLengthIcon className="h-5 w-5" />,
  },
  {
    key: 'timezones',
    label: 'timezones',
    path: 'timezones',
    logo: <TimezoneIcon className="h-5 w-5" />,
  },
  {
    key: 'timestamp',
    label: 'timestamp',
    path: 'timestamp',
    logo: <TimestampIcon className="h-5 w-5" />,
  },
  {
    key: 'uuid',
    label: 'uuid',
    path: 'uuid',
    logo: <UuidIcon className="h-5 w-5" />,
  },
  {
    key: 'pathfinding',
    label: 'pathfinding',
    path: 'pathfinding',
    logo: <PathfindingIcon className="h-5 w-5" />,
  },
];

const games: Item[] = [
  {
    key: 'conway',
    label: 'conway',
    path: 'conway',
    logo: <ConwayIcon className="h-5 w-5" />,
  },
];

const emptySubscribe = () => () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const Navbar = () => {
  const pathname = usePathname();
  const t = useTranslations('navbar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This is used to display data that can only be rendered
  // client-side, such as the theme picker.
  const didMount = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <NuiNavbar
      position="static"
      className="bg-transparent"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <MotionConfig reducedMotion="user">
        {/* Mobile: hamburger toggle — hidden on desktop */}
        <NavbarContent className="md:hidden">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
          />
        </NavbarContent>

        {/* Desktop: nav links — hidden on mobile */}
        <NavbarContent className="hidden md:flex">
          <NavbarItem isActive={pathname == '/'}>
            <span className="inline-flex flex-col gap-1">
              <Link color="foreground" href="/" as={NextLink}>
                {t('home')}
              </Link>
              {pathname == '/' && (
                <motion.span
                  layoutId="nav-indicator"
                  className="bg-accent h-0.5 w-full rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </span>
          </NavbarItem>

          <NavbarItem isActive={pathname.startsWith('/blog')}>
            <span className="inline-flex flex-col gap-1">
              <Link color="foreground" href="/blog" as={NextLink}>
                {t('blog')}
              </Link>
              {pathname.startsWith('/blog') && (
                <motion.span
                  layoutId="nav-indicator"
                  className="bg-accent h-0.5 w-full rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </span>
          </NavbarItem>

          <Dropdown>
            <NavbarItem>
              <span className="inline-flex flex-col gap-1">
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled !h-auto !min-h-0 cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent ${pathname.startsWith('/games') ? 'font-semibold' : ''}`}
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
                    {t('games')}
                  </Button>
                </DropdownTrigger>
                {pathname.startsWith('/games') && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="bg-accent h-0.5 w-full rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </span>
            </NavbarItem>
            <DropdownMenu
              aria-label={t('games')}
              selectionMode="single"
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
                  as={NextLink}
                >
                  {t(item.label)}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <NavbarItem>
              <span className="inline-flex flex-col gap-1">
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled !h-auto !min-h-0 cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent ${pathname.startsWith('/tools') ? 'font-semibold' : ''}`}
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
                    {t('tools')}
                  </Button>
                </DropdownTrigger>
                {pathname.startsWith('/tools') && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="bg-accent h-0.5 w-full rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </span>
            </NavbarItem>
            <DropdownMenu
              aria-label={t('tools')}
              selectionMode="single"
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
                  as={NextLink}
                >
                  {t(item.label)}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </MotionConfig>

      <NavbarContent justify="end">
        {didMount && <ThemeSwitcher />}
        {<LanguageSwitcher />}
      </NavbarContent>

      {/* Mobile slide-down menu */}
      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="/"
            as={NextLink}
            className="w-full"
            onPress={() => {
              setIsMenuOpen(false);
            }}
          >
            {t('home')}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            href="/blog"
            as={NextLink}
            className="w-full"
            onPress={() => {
              setIsMenuOpen(false);
            }}
          >
            {t('blog')}
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem className="pointer-events-none mt-2 opacity-50">
          <span className="text-small font-semibold uppercase">
            {t('games')}
          </span>
        </NavbarMenuItem>
        {games.map(item => (
          <NavbarMenuItem key={`mobile-game-${item.key}`}>
            <Link
              color="foreground"
              href={`/games/${item.path}`}
              as={NextLink}
              className="flex w-full items-center gap-2"
              onPress={() => {
                setIsMenuOpen(false);
              }}
            >
              {item.logo}
              {t(item.label)}
            </Link>
          </NavbarMenuItem>
        ))}

        <NavbarMenuItem className="pointer-events-none mt-2 opacity-50">
          <span className="text-small font-semibold uppercase">
            {t('tools')}
          </span>
        </NavbarMenuItem>
        {tools.map(item => (
          <NavbarMenuItem key={`mobile-tool-${item.key}`}>
            <Link
              color="foreground"
              href={`/tools/${item.path}`}
              as={NextLink}
              className="flex w-full items-center gap-2"
              onPress={() => {
                setIsMenuOpen(false);
              }}
            >
              {item.logo}
              {t(item.label)}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NuiNavbar>
  );
};
