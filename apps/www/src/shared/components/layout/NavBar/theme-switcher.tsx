"use client";

import { Button, Dropdown } from "@heroui/react";
import { isAppearance, useTheme } from "@melvinla/next-themes";
import {
  Moon as DarkThemeIcon,
  Palette as SystemThemeIcon,
  Sun as LightThemeIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { ThemeSwitcherIcon } from "#shared/components/icons/theme-switcher-icon";
import { usePrefersReducedMotion } from "#shared/hooks/use-prefers-reduced-motion";

export const ThemeSwitcher = () => {
  const t = useTranslations("navbar");
  const { resolvedAppearance, appearance, setAppearance } = useTheme();
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
        <span className="text-amber-400">
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
        <Dropdown.Menu
          aria-label={t("theme")}
          selectionMode="single"
          selectedKeys={appearance ? new Set([appearance]) : new Set(["light"])}
          onAction={(key) => {
            const value = key.toString();
            if (isAppearance(value)) {
              setAppearance(value);
              setAnimationFocus("themeChange");
            }
          }}
        >
          <Dropdown.Item id="light" textValue={t("themeLight")}>
            <LightThemeIcon width={20} /> {t("themeLight")}
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          <Dropdown.Item id="dark" textValue={t("themeDark")}>
            <DarkThemeIcon width={20} /> {t("themeDark")}
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          <Dropdown.Item id="system" textValue={t("themeSystem")}>
            <SystemThemeIcon width={20} /> {t("themeSystem")}
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
