"use client";

import { Skeleton } from "@heroui/react";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { useStats } from "#features/fortnite/hooks/use-stats";
import { AccountTypes, defaultPreset, hasStats, Preset } from "#features/fortnite/models";
import { humanizeDuration } from "#features/fortnite/utils.ts";
import { routing } from "#i18n/routing";
import { Section } from "#shared/components/layout/section";

import { AccountPresets } from "./account-presets";
import { Form } from "./form";
import { MainData } from "./main-data";
import { TableDesktop } from "./table-desktop";
import { TableMobile } from "./table-mobile";

export const Fortnite = ({
  providedName,
  providedType,
}: {
  providedName?: string;
  providedType?: AccountTypes;
}) => {
  const providedTypeIsValid = providedType && Object.values(AccountTypes).includes(providedType);

  const [preset, setPreset] = useState({
    accountName: providedName ? decodeURIComponent(providedName) : defaultPreset.accountName,
    accountType: providedType ?? defaultPreset.accountType,
    timeWindow: defaultPreset.timeWindow,
  });

  // `presetKey` is a monotonic counter included in the Form's `key` prop.
  // It guarantees the Form always remounts when a preset is selected — even
  // when the user picks the same preset twice in a row (e.g. pick Mongraal,
  // clear the input, pick Mongraal again). Without this counter the Form's
  // key string would be identical both times, React would skip the remount,
  // and the mount-time effect that fires the search would never run.
  const [presetKey, setPresetKey] = useState(0);

  const handleSetPreset = useCallback((prst: Preset) => {
    setPreset(prst);
    setPresetKey((k) => k + 1);
  }, []);

  const [name, setName] = useState(preset.accountName);
  const [accountType, setAccountType] = useState(preset.accountType);
  const [timeWindow, setTimeWindow] = useState(preset.timeWindow);
  const locale = useLocale();
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const rootT = useTranslations();
  const t = useTranslations("fortnite");

  const { data, error, isLoading } = useStats(
    name,
    accountType,
    timeWindow,
    providedType && !providedTypeIsValid,
  );

  useEffect(() => {
    let url = `${localePrefix}/tools/fortnite`;
    if (name) {
      url += `/${encodeURIComponent(name)}/${accountType}`;
    }

    if (globalThis.location.pathname !== url) {
      // Use pushState directly instead of router.push to avoid triggering a
      // Next.js navigation. Even with `shallow: true`, the App Router fires
      // enough internal machinery to disrupt React Aria's focus management,
      // causing the search input to lose focus after each debounce tick.
      // pushState only updates the URL bar without touching the React tree.
      globalThis.history.pushState(undefined, "", url);
    }
  }, [name, accountType, localePrefix]);

  if (providedType && !providedTypeIsValid) {
    return notFound();
  }

  return (
    <>
      <Section>
        <header className="flex flex-col gap-10 sm:flex-row sm:gap-0">
          <h1 className="basis-full text-center text-2xl font-extrabold sm:text-start sm:text-5xl">
            {t.rich("title", {
              name: (chunks) => (
                <span className="bg-linear-to-b from-[#1c78ff] to-[#4983f8] bg-clip-text font-fortnite-latin text-3xl leading-normal text-transparent uppercase sm:text-6xl">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          <Form
            onAccountNameChange={setName}
            onAccountTypeChange={setAccountType}
            onTimeWindowChange={setTimeWindow}
            defaultTimeWindow={preset.timeWindow}
            defaultAccountType={preset.accountType}
            defaultAccountName={preset.accountName}
            key={`${preset.accountName}-${preset.accountType}-${preset.timeWindow}-${String(presetKey)}`}
          />
        </header>
      </Section>

      {!isLoading && !error && !data && (
        <Section className="mb-16 flex flex-col gap-10">
          <AccountPresets setPreset={handleSetPreset} />
        </Section>
      )}

      {!isLoading && (error ?? (name && !hasStats(data))) && (
        <Section className="text-center text-xl font-extrabold text-red-400 sm:text-4xl">
          <div>
            {!error && !hasStats(data) ? (
              <>{t("errors.accountNoData")}</>
            ) : error?.data?.httpStatus === 403 ? (
              <>{t("errors.accountPrivate")}</>
            ) : error?.data?.httpStatus === 404 ? (
              <>{t("errors.notFound")}</>
            ) : (
              <>{t("errors.serverError")}</>
            )}
          </div>
        </Section>
      )}

      {!error && (isLoading || hasStats(data)) && (
        <>
          <Section className="leading-inherit text-center text-xl font-extrabold sm:text-4xl">
            <div className="animate-[levitate_3s_ease-in-out_infinite]">
              {isLoading || !hasStats(data) ? (
                <>
                  <Skeleton className="mx-auto mb-2 h-8 w-72 rounded-full sm:h-10 sm:w-96" />
                  <Skeleton className="mx-auto h-8 w-72 rounded-full sm:h-10 sm:w-1/2" />
                </>
              ) : (
                <>
                  {humanizeDuration(rootT, data.stats.all.overall.minutesPlayed)} <br />
                  {t("timeSpent")}
                </>
              )}
            </div>
          </Section>

          <Section>
            <MainData data={data} isLoading={isLoading} />
          </Section>

          <Section
            fullScreen
            className="mx-4 mb-16 max-w-7xl md:max-w-full xl:mx-16 2xl:mx-auto 2xl:max-w-7xl"
          >
            {/* Desktop only */}
            <div className="hidden md:block">
              <TableDesktop data={data} isLoading={isLoading} />
            </div>
            {/* Mobile / small screen only */}
            <div className="block md:hidden">
              <TableMobile data={data} isLoading={isLoading} />
            </div>
          </Section>
        </>
      )}
    </>
  );
};
