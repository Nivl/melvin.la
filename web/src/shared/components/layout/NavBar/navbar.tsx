"use client";

import { Button, Dropdown, Label } from "@heroui/react";
import {
  BookText as BlogIcon,
  Calendar as TimestampIcon,
  Dices as UuidIcon,
  Globe as TimezoneIcon,
  House as HomeIcon,
  LayoutGrid as BeatmakerIcon,
  Route as PathfindingIcon,
  Type as StringLengthIcon,
} from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";
import { FaChevronDown as DownIcon } from "react-icons/fa";
import { GiConwayLifeGlider as ConwayIcon } from "react-icons/gi";
import { TbBrandFortnite as FortniteIcon } from "react-icons/tb";

import { Link as NextLink, usePathname, useRouter } from "#i18n/routing";
import { Section } from "#shared/components/layout/section";

import { LanguageSwitcher } from "./language-switcher";
import { MobileDrawerLoading } from "./mobile-drawer-loading";
import type { NavSection } from "./nav-sections";
import { ThemeSwitcher } from "./theme-switcher";

const MobileDrawer = dynamic(
  async () => {
    const mod = await import("./mobile-drawer");
    return mod.MobileDrawer;
  },
  {
    loading: () => <MobileDrawerLoading />,
    ssr: false,
  },
);

const navSections: NavSection[] = [
  {
    href: "/",
    key: "home",
    labelKey: "home",
    logo: <HomeIcon className="h-5 w-5" />,
    type: "link",
  },
  {
    href: "/blog",
    key: "blog",
    labelKey: "blog",
    logo: <BlogIcon className="h-5 w-5" />,
    type: "link",
  },
  {
    items: [
      {
        key: "conway",
        labelKey: "conway",
        logo: <ConwayIcon className="h-5 w-5" />,
      },
      {
        key: "beatmaker",
        labelKey: "beatmaker",
        logo: <BeatmakerIcon className="h-5 w-5" />,
      },
    ],
    key: "games",
    labelKey: "games",
    pathPrefix: "/games",
    type: "group",
  },
  {
    items: [
      {
        key: "fortnite",
        labelKey: "fortnite",
        logo: <FortniteIcon className="h-5 w-5" />,
      },
      {
        key: "string-length",
        labelKey: "string-length",
        logo: <StringLengthIcon className="h-5 w-5" />,
      },
      {
        key: "timezones",
        labelKey: "timezones",
        logo: <TimezoneIcon className="h-5 w-5" />,
      },
      {
        key: "timestamp",
        labelKey: "timestamp",
        logo: <TimestampIcon className="h-5 w-5" />,
      },
      {
        key: "uuid",
        labelKey: "uuid",
        logo: <UuidIcon className="h-5 w-5" />,
      },
      {
        key: "pathfinding",
        labelKey: "pathfinding",
        logo: <PathfindingIcon className="h-5 w-5" />,
      },
    ],
    key: "tools",
    labelKey: "tools",
    pathPrefix: "/tools",
    type: "group",
  },
];

const emptySubscribe = () => () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const Navbar = () => {
  const pathname = usePathname();
  const t = useTranslations("navbar");

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
    if (section.type === "link") {
      return section.href === "/" ? pathname === "/" : pathname.startsWith(section.href);
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
              {navSections.map((section) => {
                const active = isSectionActive(section);
                const label = t(section.labelKey);

                if (section.type === "link") {
                  return (
                    <span key={section.key} className="inline-flex flex-col">
                      <NextLink
                        href={section.href}
                        className={`h-8 content-center px-3 text-sm motion-safe:transition ${active ? "font-semibold opacity-100" : "font-normal opacity-75 hover:opacity-100"} hover:text-primary`}
                      >
                        {label}
                      </NextLink>

                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="h-0.5 w-full rounded-full bg-accent"
                          transition={{
                            damping: 35,
                            stiffness: 500,
                            type: "spring",
                          }}
                        />
                      )}
                    </span>
                  );
                }

                return (
                  <div key={section.key} className="relative">
                    <Dropdown>
                      <span className="inline-flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`group h-8 hover:bg-background aria-expanded:bg-background motion-safe:transition ${active ? "font-semibold opacity-100" : "opacity-75 hover:opacity-100"}`}
                        >
                          {label}
                          <DownIcon className="w-2.5 transition duration-700 ease-spring-soft group-aria-expanded:-rotate-180 motion-reduce:transition-none" />
                        </Button>
                        {active && (
                          <motion.span
                            layoutId="nav-indicator"
                            className="h-0.5 w-full rounded-full bg-accent"
                            transition={{
                              damping: 35,
                              stiffness: 500,
                              type: "spring",
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
                            active && pathname.split("/")[2]
                              ? new Set([pathname.split("/")[2]])
                              : new Set<string>()
                          }
                          onAction={(key) => {
                            router.push(`${section.pathPrefix}/${key.toString()}`, {
                              locale: locale,
                            });
                          }}
                        >
                          {section.items.map((item) => (
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

            <MobileDrawer
              isOpen={isMobileDrawerOpen}
              onClose={closeMobileDrawer}
              onOpenChange={setIsMobileDrawerOpen}
              sections={navSections}
              t={t}
            />

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
