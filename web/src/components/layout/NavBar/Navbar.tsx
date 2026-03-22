'use client';

import { Button, Drawer, Dropdown, Label } from '@heroui/react';
import { motion, MotionConfig } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { ReactNode, useState, useSyncExternalStore } from 'react';
import { FaChevronDown as DownIcon } from 'react-icons/fa';
import { FaRegCalendar as TimestampIcon } from 'react-icons/fa6';
import {
  GiConwayLifeGlider as ConwayIcon,
  GiPerspectiveDiceSixFacesRandom as UuidIcon,
} from 'react-icons/gi';
import {
  LuBookText as BlogIcon,
  LuHouse as HomeIcon,
  LuMenu as MenuIcon,
} from 'react-icons/lu';
import { MdOutlineTextFields as StringLengthIcon } from 'react-icons/md';
import { PiPathBold as PathfindingIcon } from 'react-icons/pi';
import { RiTimeZoneLine as TimezoneIcon } from 'react-icons/ri';
import { TbBrandFortnite as FortniteIcon } from 'react-icons/tb';
import { TfiLayoutGrid4Alt as BeatmakerIcon } from 'react-icons/tfi';

import { Link as NextLink, usePathname, useRouter } from '#i18n/routing';

import { Section } from '../Section';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

type NavLink = {
  type: 'link';
  key: string;
  labelKey: string;
  href: string;
  logo: ReactNode;
};

type NavGroup = {
  type: 'group';
  key: string;
  labelKey: string;
  pathPrefix: string;
  items: {
    key: string;
    labelKey: string;
    logo: ReactNode;
  }[];
};

type NavSection = NavLink | NavGroup;

const navSections: NavSection[] = [
  {
    type: 'link',
    key: 'home',
    labelKey: 'home',
    href: '/',
    logo: <HomeIcon className="h-5 w-5" />,
  },
  {
    type: 'link',
    key: 'blog',
    labelKey: 'blog',
    href: '/blog',
    logo: <BlogIcon className="h-5 w-5" />,
  },
  {
    type: 'group',
    key: 'games',
    labelKey: 'games',
    pathPrefix: '/games',
    items: [
      {
        key: 'conway',
        labelKey: 'conway',
        logo: <ConwayIcon className="h-5 w-5" />,
      },
      {
        key: 'beatmaker',
        labelKey: 'beatmaker',
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
        logo: <FortniteIcon className="h-5 w-5" />,
      },
      {
        key: 'string-length',
        labelKey: 'string-length',
        logo: <StringLengthIcon className="h-5 w-5" />,
      },
      {
        key: 'timezones',
        labelKey: 'timezones',
        logo: <TimezoneIcon className="h-5 w-5" />,
      },
      {
        key: 'timestamp',
        labelKey: 'timestamp',
        logo: <TimestampIcon className="h-5 w-5" />,
      },
      {
        key: 'uuid',
        labelKey: 'uuid',
        logo: <UuidIcon className="h-5 w-5" />,
      },
      {
        key: 'pathfinding',
        labelKey: 'pathfinding',
        logo: <PathfindingIcon className="h-5 w-5" />,
      },
    ],
  },
];

const emptySubscribe = () => () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const Navbar = () => {
  const pathname = usePathname();
  const t = useTranslations('navbar');

  const router = useRouter();
  const locale = useLocale();

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

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <Section className="mt-0 sm:mt-0 xl:mt-0">
      <nav className="h-[var(--navbar-height)] bg-transparent">
        <MotionConfig reducedMotion="user">
          <div className="flex items-center justify-between py-3 md:px-4">
            <div className="hidden items-center gap-3 md:flex">
              {navSections.map(section => {
                const active = isSectionActive(section);
                const label = t(section.labelKey);

                if (section.type === 'link') {
                  return (
                    <span
                      key={section.key}
                      className="inline-flex flex-col gap-1"
                    >
                      <NextLink
                        href={section.href}
                        className={`h-8 content-center px-3 text-sm motion-safe:transition ${active ? 'font-semibold opacity-100' : 'font-normal opacity-75 hover:opacity-100'} hover:text-primary`}
                      >
                        {label}
                      </NextLink>

                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="bg-nivl h-0.5 w-full rounded-full"
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                    </span>
                  );
                }

                return (
                  <div key={section.key} className="relative">
                    <Dropdown>
                      <span className="inline-flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`group hover:bg-background aria-expanded:bg-background h-8 motion-safe:transition ${active ? 'font-semibold opacity-100' : 'opacity-75 hover:opacity-100'}`}
                        >
                          {label}
                          <DownIcon
                            className={
                              'ease-spring-soft w-2.5 transition duration-700 group-aria-expanded:-rotate-180 motion-reduce:transition-none'
                            }
                          />
                        </Button>
                        {active && (
                          <motion.span
                            layoutId="nav-indicator"
                            className="bg-nivl h-0.5 w-full rounded-full"
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 35,
                            }}
                          />
                        )}
                      </span>

                      <Dropdown.Popover>
                        <Dropdown.Menu
                          aria-label={t(section.labelKey)}
                          selectionMode="single"
                          items={section.items}
                          selectedKeys={
                            active && pathname.split('/')[2]
                              ? new Set([pathname.split('/')[2]])
                              : new Set<string>()
                          }
                          onAction={key => {
                            router.push(
                              `${section.pathPrefix}/${key.toString()}`,
                              { locale: locale },
                            );
                          }}
                        >
                          {section.items.map(item => (
                            <Dropdown.Item id={item.key} key={item.key}>
                              {item.logo}
                              <Label>{t(item.labelKey)}</Label>
                              <Dropdown.ItemIndicator />
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </div>
                );
              })}
            </div>

            <Drawer
              isOpen={isMobileDrawerOpen}
              onOpenChange={setIsMobileDrawerOpen}
            >
              <Button
                className="p-0 md:hidden"
                variant="ghost"
                aria-label={t('openMenu')}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>

              <Drawer.Backdrop variant="blur">
                <Drawer.Content placement="left">
                  <Drawer.Dialog className="">
                    <Drawer.CloseTrigger aria-label={t('closeMenu')} />
                    <Drawer.Header>
                      <Drawer.Heading>{t('menu')}</Drawer.Heading>
                    </Drawer.Header>
                    <Drawer.Body>
                      <nav
                        className="flex flex-col gap-1"
                        data-testid="navbar-mobile-menu"
                      >
                        {navSections.map(section => {
                          const label = t(section.labelKey);

                          if (section.type === 'link') {
                            return (
                              <NextLink
                                key={section.key}
                                href={section.href}
                                onClick={closeMobileDrawer}
                                className="text-foreground hover:bg-default flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
                              >
                                {section.logo}
                                {label}
                              </NextLink>
                            );
                          }

                          return (
                            <div key={section.key}>
                              <div className="mt-5 mb-2 font-semibold uppercase">
                                {label}
                              </div>

                              <div className="flex flex-col gap-1">
                                {section.items.map(item => (
                                  <NextLink
                                    key={item.key}
                                    onClick={closeMobileDrawer}
                                    href={`${section.pathPrefix}/${item.key}`}
                                    className="text-foreground hover:bg-default flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
                                  >
                                    {item.logo}
                                    {t(item.labelKey)}
                                  </NextLink>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </nav>
                    </Drawer.Body>
                  </Drawer.Dialog>
                </Drawer.Content>
              </Drawer.Backdrop>
            </Drawer>

            <div className="flex items-center gap-2">
              {didMount && <ThemeSwitcher />}
              <LanguageSwitcher />
            </div>
          </div>
        </MotionConfig>
      </nav>
    </Section>
  );
};
