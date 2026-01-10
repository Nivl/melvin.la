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
import { LanguagesIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { ReactNode, useSyncExternalStore } from 'react';
import { FaChevronDown as DownIcon } from 'react-icons/fa';
import { FaRegCalendar as TimestampIcon } from 'react-icons/fa6';
import {
  GiConwayLifeGlider as ConwayIcon,
  GiPerspectiveDiceSixFacesRandom as UuidIcon,
} from 'react-icons/gi';
import { MdOutlineTextFields as StringLengthIcon } from 'react-icons/md';
import { RiTimeZoneLine as TimezoneIcon } from 'react-icons/ri';
import { TbBrandFortnite as FortniteIcon } from 'react-icons/tb';

import { Link as NextLink, usePathname, useRouter } from '#i18n/routing';

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
    path: '/fortnite',
    logo: <FortniteIcon className="h-5 w-5" />,
  },
  {
    key: 'string-length',
    label: 'string-length',
    path: '/string-length',
    logo: <StringLengthIcon className="h-5 w-5" />,
  },
  {
    key: 'timezones',
    label: 'timezones',
    path: '/timezones',
    logo: <TimezoneIcon className="h-5 w-5" />,
  },
  {
    key: 'timestamp',
    label: 'timestamp',
    path: '/timestamp',
    logo: <TimestampIcon className="h-5 w-5" />,
  },
  {
    key: 'uuid',
    label: 'uuid',
    path: '/uuid',
    logo: <UuidIcon className="h-5 w-5" />,
  },
];

const games: Item[] = [
  {
    key: 'conway',
    label: 'conway',
    path: '/conway',
    logo: <ConwayIcon className="h-5 w-5" />,
  },
];

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

const emptySubscribe = () => () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const Navbar = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('navbar');

  // This is used to display data that can only be rendered
  // client-side, such as the theme picker.
  const didMount = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <NuiNavbar position="static" className="bg-transparent">
      <NavbarContent>
        <NavbarItem isActive={pathname == '/'}>
          <Link color="foreground" href="/" as={NextLink}>
            {t('home')}
          </Link>
        </NavbarItem>

        <NavbarItem isActive={pathname.startsWith('/blog')}>
          <Link color="foreground" href="/blog" as={NextLink}>
            {t('blog')}
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
                {t('games')}
              </Button>
            </DropdownTrigger>
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
                {t('tools')}
              </Button>
            </DropdownTrigger>
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

      <NavbarContent justify="end">
        {didMount && <ThemeSwitcher />}

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className={`text-medium text-foreground tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent`}
                variant="light"
                isIconOnly
                aria-label={t('changeLanguage')}
              >
                <span className={`text-amber-400`}>
                  <LanguagesIcon width={24} height={24} />
                </span>
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
      </NavbarContent>
    </NuiNavbar>
  );
};
