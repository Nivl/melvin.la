"use client";

import { Button, Dropdown } from "@heroui/react";
import { captureException } from "@sentry/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { Locales } from "#i18n/locales";
import { LOCALE_COOKIE } from "#i18n/locales";
import { usePathname, useRouter } from "#i18n/routing";
import { LanguageSwitcherIcon } from "#shared/components/icons/language-switcher-icon";
import { usePrefersReducedMotion } from "#shared/hooks/use-prefers-reduced-motion";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

type Language = {
  label: string;
  isAI: boolean;
};

// Keyed by Locales so the compiler forces an entry for every locale and
// rejects unknown keys: the keys end up in the NEXT_LOCALE cookie that the
// routing rules match against. Insertion order is the menu order.
const languages: Record<Locales, Language> = {
  en: { isAI: false, label: "English" },
  es: { isAI: true, label: "Español" },
  fr: { isAI: true, label: "Français" },
  ja: { isAI: true, label: "日本語" },
  ko: { isAI: true, label: "한국어" },
  zh: { isAI: true, label: "中文 (简体)" },
  "zh-tw": { isAI: true, label: "中文 (繁體)" },
};

export function LanguageSwitcher() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isBooped, setIsBooped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return undefined;
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
        className="tap-highlight-transparent active:opacity-disabled cursor-pointer bg-transparent p-0 text-base text-foreground antialiased transition-opacity hover:opacity-80 data-[hover=true]:bg-transparent"
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
            const newLocale = key.toString();
            const navigate = () => {
              router.push({ pathname }, { locale: newLocale });
            };

            // Record the explicit choice (also for 'en') so the routing-layer
            // locale detection (routing-rules.ts) stops second-guessing it
            // from Accept-Language. Navigation waits for the write: switching
            // to 'en' targets an unprefixed URL, which the detection redirects
            // keep bouncing until the cookie is committed.
            if ("cookieStore" in globalThis) {
              cookieStore
                .set({
                  expires: Date.now() + ONE_YEAR_MS,
                  name: LOCALE_COOKIE,
                  path: "/",
                  sameSite: "lax",
                  value: newLocale,
                })
                .catch(captureException)
                .finally(navigate);
              return;
            }

            // eslint-disable-next-line unicorn/no-document-cookie -- only option on browsers without the Cookie Store API (Safari < 18.4, Firefox < 132)
            document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${String(ONE_YEAR_MS / 1000)}; SameSite=Lax`;
            navigate();
          }}
        >
          {Object.entries(languages).map(([key, lang]) => (
            <Dropdown.Item id={key} textValue={lang.label} key={key}>
              {lang.label} {lang.isAI ? <sup> AI</sup> : ""}
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
