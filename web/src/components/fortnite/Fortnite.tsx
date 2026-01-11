'use client';

import { Skeleton } from '@heroui/skeleton';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Section } from '#components/layout/Section';
import { useStats } from '#hooks/fortnite/useStats';
import { usePathname, useRouter } from '#i18n/routing';
import { humanizeDuration } from '#utils/fortnite';

import { AccountPresets, defaults, Preset } from './AccountPresets';
import { AccountTypes, Form } from './Form';
import { MainData } from './MainData';
import { TableDesktop } from './TableDesktop';
import { TableMobile } from './TableMobile';

export const Fortnite = ({
  providedName,
  providedType,
}: {
  providedName?: string;
  providedType?: AccountTypes;
}) => {
  const providedTypeIsValid =
    providedType && Object.values(AccountTypes).includes(providedType);

  const [preset, setPreset] = useState<Preset>({
    accountName: providedName
      ? decodeURIComponent(providedName)
      : defaults.accountName,
    accountType: providedType ?? defaults.accountType,
    timeWindow: defaults.timeWindow,
  });

  const [name, setName] = useState(preset.accountName);
  const [accountType, setAccountType] = useState(preset.accountType);
  const [timeWindow, setTimeWindow] = useState(preset.timeWindow);
  const router = useRouter();
  const pathname = usePathname();
  const rootT = useTranslations();
  const t = useTranslations('fortnite');

  const { data, error, isLoading } = useStats(
    name,
    accountType,
    timeWindow,
    providedType && !providedTypeIsValid,
  );

  useEffect(() => {
    let url = '/tools/fortnite';
    if (name) {
      url += `/${encodeURIComponent(name)}/${accountType}`;
    }

    if (pathname != url) {
      router.push(url, {
        // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions' but is valid. See https://github.com/vercel/next.js/issues/60007
        shallow: true,
      });
    }

    // We don't need the router here, it's only for a shallow change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, accountType]);

  if (providedType && !providedTypeIsValid) {
    return notFound();
  }

  return (
    <>
      <Section>
        <header className="flex flex-col gap-10 sm:flex-row sm:gap-0">
          <h1 className="basis-full text-center text-2xl font-extrabold sm:text-start sm:text-5xl">
            {t.rich('title', {
              name: chunks => (
                <span className="font-fortnite bg-linear-to-b from-[#1c78ff] to-[#4983f8] bg-clip-text text-3xl text-transparent uppercase sm:text-6xl">
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
            key={`${preset.accountName}-${preset.accountType}-${preset.timeWindow}`}
          />
        </header>
      </Section>

      {!isLoading && !error && !data && (
        <Section className="mb-16 flex flex-col gap-10">
          <AccountPresets setPreset={setPreset} />
        </Section>
      )}

      {!isLoading && error && (
        <Section className="text-center text-xl font-extrabold text-red-400 sm:text-4xl">
          <div>
            {error.code === 403 ? (
              <>{t('errors.accountPrivate')}</>
            ) : error.code === 404 ? (
              <>{t('errors.notFound')}</>
            ) : (
              <>{t('errors.serverError')}</>
            )}
          </div>
        </Section>
      )}

      {!error && name && (
        <>
          <Section className="leading-inherit text-center text-xl font-extrabold sm:text-4xl">
            <div className="animate-[levitate_3s_ease-in-out_infinite]">
              {isLoading || !data ? (
                <>
                  <Skeleton className="mx-auto mb-5 h-8 w-72 rounded-full sm:mb-7 sm:h-10 sm:w-96" />
                  <Skeleton className="mx-auto h-8 w-72 rounded-full sm:h-10 sm:w-1/2" />
                </>
              ) : (
                <>
                  {humanizeDuration(
                    rootT,
                    data.stats.all.overall.minutesPlayed,
                  )}{' '}
                  <br />
                  {t('timeSpent')}
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
