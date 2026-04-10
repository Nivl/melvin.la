"use client";

import { Button, Dropdown } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { usePathname, useRouter } from "#i18n/routing";
import { LanguageSwitcherIcon } from "#shared/components/icons/LanguageSwitcherIcon.tsx";
import { usePrefersReducedMotion } from "#shared/hooks/usePrefersReducedMotion.ts";

type Language = {
  key: string;
  label: string;
  isAI: boolean;
};

const languages: Language[] = [
  {
    key: "en",
    label: "English",
    isAI: false,
  },
  {
    key: "es",
    label: "Español",
    isAI: true,
  },
  {
    key: "fr",
    label: "Français",
    isAI: true,
  },
  {
    key: "ja",
    label: "日本語",
    isAI: true,
  },
  {
    key: "ko",
    label: "한국어",
    isAI: true,
  },
  {
    key: "zh",
    label: "中文 (简体)",
    isAI: true,
  },
  {
    key: "zh-tw",
    label: "中文 (繁體)",
    isAI: true,
  },
];

export const LanguageSwitcher = () => {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isBooped, setIsBooped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsBooped(false);
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [isBooped]);

  return (
    <Dropdown>
      <Button
        className={`tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 text-base text-foreground antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent`}
        variant="ghost"
        isIconOnly
        aria-label={t("changeLanguage")}
        onMouseEnter={() => {
          if (!reducedMotion) {
            setIsBooped(true);
          }
        }}
      >
        <LanguageSwitcherIcon isBooped={isBooped} />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label={t("language")}
          selectionMode="single"
          selectedKeys={new Set([locale])}
          onAction={(key) => {
            router.push({ pathname }, { locale: key.toString() });
          }}
        >
          {languages.map((lang) => (
            <Dropdown.Item id={lang.key} textValue={lang.label} key={lang.key}>
              {lang.label} {lang.isAI ? <sup> AI</sup> : ""}
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
