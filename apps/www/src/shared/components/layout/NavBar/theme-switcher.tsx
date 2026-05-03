"use client";

import { Button, Dropdown, Header, Separator } from "@heroui/react";
import { isAppearance, useTheme } from "@melvinla/next-themes";
import {
  Moon as DarkThemeIcon,
  Palette as ThemeIcon,
  Sun as LightThemeIcon,
  SunMoonIcon as SystemThemeIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { ThemeSwitcherIcon } from "#shared/components/icons/theme-switcher-icon";
import { usePrefersReducedMotion } from "#shared/hooks/use-prefers-reduced-motion";

// Adding or removing something in this array requires updating the translations.
// navbar.themeSwitcher.colors
// const themesColors = ["blue", "green", "orange", "pink", "purple", "red", "sand"];

const themesColors = [
  { className: "text-theme-blue", i18nKey: "colors.blue", key: "blue" },
  { className: "text-theme-green", i18nKey: "colors.green", key: "green" },
  { className: "text-theme-orange", i18nKey: "colors.orange", key: "orange" },
  { className: "text-theme-pink", i18nKey: "colors.pink", key: "pink" },
  { className: "text-theme-purple", i18nKey: "colors.purple", key: "purple" },
  { className: "text-theme-red", i18nKey: "colors.red", key: "red" },
  { className: "text-theme-sand", i18nKey: "colors.sand", key: "sand" },
];

const isTheme = (value: string | undefined): value is (typeof themesColors)[number]["key"] =>
  value !== undefined && themesColors.some((theme) => theme.key === value);

export const ThemeSwitcher = () => {
  const t = useTranslations("navbar.themeSwitcher");
  const { resolvedAppearance, appearance, setAppearance, theme, setTheme } = useTheme();
  const [animationFocus, setAnimationFocus] = useState<"boop" | "themeChange">("boop");
  const [isBooped, setIsBooped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setIsBooped(false);
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [isBooped]);

  return (
    <Dropdown>
      <Button
        className="tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 text-base text-foreground antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent"
        variant="ghost"
        isIconOnly
        aria-label={t("switchTheme")}
        onMouseEnter={() => {
          if (!reducedMotion) {
            setIsBooped(true);
            setAnimationFocus("boop");
          }
        }}
      >
        <span className="text-accent">
          <ThemeSwitcherIcon
            theme={resolvedAppearance === "dark" ? "dark" : "light"}
            animationFocus={animationFocus}
            width={24}
            height={24}
            isBooped={isBooped}
          />
        </span>
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label={t("theme")}>
          <Dropdown.Section
            selectionMode="single"
            selectedKeys={appearance ? new Set([appearance]) : new Set(["light"])}
            onSelectionChange={(keys) => {
              if (keys === "all") {
                return;
              }
              const value = keys.values().next().value?.toString();
              if (isAppearance(value)) {
                setAppearance(value);
                setAnimationFocus("themeChange");
              }
            }}
          >
            <Header>{t("appearance")}</Header>
            <Dropdown.Item id="light" textValue={t("appearanceLight")}>
              <LightThemeIcon width={20} /> {t("appearanceLight")}
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
            <Dropdown.Item id="dark" textValue={t("appearanceDark")}>
              <DarkThemeIcon width={20} /> {t("appearanceDark")}
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
            <Dropdown.Item id="system" textValue={t("appearanceSystem")}>
              <SystemThemeIcon width={20} /> {t("appearanceSystem")}
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          </Dropdown.Section>

          <Separator />

          <Dropdown.Section
            selectionMode="single"
            selectedKeys={theme ? new Set([theme]) : new Set([themesColors[0].key])}
            onSelectionChange={(keys) => {
              if (keys === "all") {
                return;
              }
              const value = keys.values().next().value?.toString();
              if (isTheme(value)) {
                setTheme(value);
                setAnimationFocus("themeChange");
              }
            }}
          >
            <Header>{t("hue")}</Header>
            {themesColors.map((color) => (
              <Dropdown.Item key={color.key} id={color.key} textValue={t(color.i18nKey)}>
                <ThemeIcon width={20} className={`${color.className}`} /> {t(color.i18nKey)}
                <Dropdown.ItemIndicator />
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
