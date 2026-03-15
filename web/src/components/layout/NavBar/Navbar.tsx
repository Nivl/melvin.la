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
import { Fragment, ReactNode, useState, useSyncExternalStore } from 'react';
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
import { TfiLayoutGrid4Alt as BeatmakerIcon } from 'react-icons/tfi';

import { Link as NextLink, usePathname } from '#i18n/routing';

import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

type NavLink = {
  type: 'link';
  key: string;
  labelKey: string;
  href: string;
};

type NavGroup = {
  type: 'group';
  key: string;
  labelKey: string;
  pathPrefix: string;
  items: {
    key: string;
    labelKey: string;
    path: string;
    logo: ReactNode;
  }[];
};

type NavSection = NavLink | NavGroup;

const navSections: NavSection[] = [
  { type: 'link', key: 'home', labelKey: 'home', href: '/' },
  { type: 'link', key: 'blog', labelKey: 'blog', href: '/blog' },
  {
    type: 'group',
    key: 'games',
    labelKey: 'games',
    pathPrefix: '/games',
    items: [
      {
        key: 'conway',
        labelKey: 'conway',
        path: 'conway',
        logo: <ConwayIcon className="h-5 w-5" />,
      },
      {
        key: 'beatmaker',
        labelKey: 'beatmaker',
        path: 'beatmaker',
        logo: <BeatmakerIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    type: 'group',
    key: 'tools',
    labelKey: 'tools',
    pathPrefix: '/tools',
    items: [
      {
        key: 'fortnite',
        labelKey: 'fortnite',
        path: 'fortnite',
        logo: <FortniteIcon className="h-5 w-5" />,
      },
      {
        key: 'string-length',
        labelKey: 'string-length',
        path: 'string-length',
        logo: <StringLengthIcon className="h-5 w-5" />,
      },
      {
        key: 'timezones',
        labelKey: 'timezones',
        path: 'timezones',
        logo: <TimezoneIcon className="h-5 w-5" />,
      },
      {
        key: 'timestamp',
        labelKey: 'timestamp',
        path: 'timestamp',
        logo: <TimestampIcon className="h-5 w-5" />,
      },
      {
        key: 'uuid',
        labelKey: 'uuid',
        path: 'uuid',
        logo: <UuidIcon className="h-5 w-5" />,
      },
      {
        key: 'pathfinding',
        labelKey: 'pathfinding',
        path: 'pathfinding',
        logo: <PathfindingIcon className="h-5 w-5" />,
      },
    ],
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

  const isSectionActive = (section: NavSection) => {
    if (section.type === 'link') {
      return section.href === '/'
        ? pathname === '/'
        : pathname.startsWith(section.href);
    }
    return pathname.startsWith(section.pathPrefix);
  };

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
          {navSections.map(section => {
            const active = isSectionActive(section);
            const label = t(section.labelKey);

            if (section.type === 'link') {
              return (
                <NavbarItem key={section.key} isActive={active}>
                  <span className="inline-flex flex-col gap-1">
                    <Link color="foreground" href={section.href} as={NextLink}>
                      {label}
                    </Link>
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="bg-accent h-0.5 w-full rounded-full"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </span>
                </NavbarItem>
              );
            }

            return (
              <Dropdown key={section.key}>
                <NavbarItem>
                  <span className="inline-flex flex-col gap-1">
                    <DropdownTrigger>
                      <Button
                        disableRipple
                        className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled !h-auto !min-h-0 cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent ${active ? 'font-semibold' : ''}`}
                        radius="sm"
                        variant="light"
                        endContent={
                          <DownIcon
                            className={
                              'ease-spring-soft transition duration-700 group-aria-expanded:-rotate-180 motion-reduce:transition-none ' +
                              (active ? '' : 'opacity-70')
                            }
                          />
                        }
                      >
                        {label}
                      </Button>
                    </DropdownTrigger>
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="bg-accent h-0.5 w-full rounded-full"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </span>
                </NavbarItem>
                <DropdownMenu
                  aria-label={label}
                  selectionMode="single"
                  variant="flat"
                  items={section.items}
                  selectedKeys={
                    active && pathname.split('/')[2]
                      ? new Set([pathname.split('/')[2]])
                      : new Set<string>()
                  }
                >
                  {item => (
                    <DropdownItem
                      key={item.key}
                      startContent={item.logo}
                      href={`${section.pathPrefix}/${item.path}`}
                      as={NextLink}
                    >
                      {t(item.labelKey)}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            );
          })}
        </NavbarContent>
      </MotionConfig>

      <NavbarContent justify="end">
        {didMount && <ThemeSwitcher />}
        {<LanguageSwitcher />}
      </NavbarContent>

      {/* Mobile slide-down menu */}
      <NavbarMenu data-testid="navbar-mobile-menu">
        {navSections.map(section => {
          const label = t(section.labelKey);

          if (section.type === 'link') {
            return (
              <NavbarMenuItem key={`mobile-${section.key}`}>
                <Link
                  color="foreground"
                  href={section.href}
                  as={NextLink}
                  className="w-full"
                  onPress={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  {label}
                </Link>
              </NavbarMenuItem>
            );
          }

          return (
            <Fragment key={`mobile-${section.key}`}>
              <NavbarMenuItem className="pointer-events-none mt-2 opacity-50">
                <span className="text-small font-semibold uppercase">
                  {label}
                </span>
              </NavbarMenuItem>

              {section.items.map(item => (
                <NavbarMenuItem key={`mobile-${section.key}-${item.key}`}>
                  <Link
                    color="foreground"
                    href={`${section.pathPrefix}/${item.path}`}
                    as={NextLink}
                    className="flex w-full items-center gap-2"
                    onPress={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.logo}
                    {t(item.labelKey)}
                  </Link>
                </NavbarMenuItem>
              ))}
            </Fragment>
          );
        })}
      </NavbarMenu>
    </NuiNavbar>
  );
};
