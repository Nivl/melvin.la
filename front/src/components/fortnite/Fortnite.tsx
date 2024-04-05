'use client';

import { Skeleton } from '@nextui-org/react';
import { useState } from 'react';

import { Section } from '@/components/Home/Section';
import { ErrorWithCode } from '@/error';
import { ErrCode, useStats } from '@/hooks/fortnite/useStats';
import { humanizeDuration } from '@/utils';

import { AccountTypes, Form, TimeWindow } from './Form';
import { MainData } from './MainData';
import { TableDesktop } from './TableDesktop';
import { TableMobile } from './TableMobile';

const defaults = {
  accountName: '',
  accountType: AccountTypes.Epic,
  timeWindow: TimeWindow.Lifetime,
};

export const Fortnite = () => {
  const [name, setName] = useState(defaults.accountName);
  const [accountType, setAccountType] = useState(defaults.accountType);
  const [timeWindow, setTimeWindow] = useState(defaults.timeWindow);

  const { data, error, isLoading } = useStats(name, accountType, timeWindow);

  return (
    <>
      <Section>
        <header className="flex flex-col gap-10 sm:flex-row sm:gap-0">
          <h1 className="basis-full text-center text-2xl font-black sm:text-start sm:text-5xl">
            See how well you are doing in{' '}
            <span className="bg-gradient-to-b from-[#FF1CF7] to-[#b249f8] bg-clip-text font-fortnite text-3xl uppercase text-transparent sm:text-6xl">
              Fortnite
            </span>
          </h1>

          <Form
            onAccountNameChange={setName}
            onAccountTypeChange={setAccountType}
            onTimeWindowChange={setTimeWindow}
            defaultTimeWindow={defaults.timeWindow}
            defaultAccountType={defaults.accountType}
            defaultAccountName={defaults.accountName}
          />
        </header>
      </Section>

      {!isLoading && error && (
        <Section className="text-center text-xl font-black text-red-400 sm:text-4xl">
          <div>
            {error instanceof ErrorWithCode &&
            error.code === ErrCode.AccountPrivate ? (
              <>This gamer doesn&apos;t want you to see their data </>
            ) : error instanceof ErrorWithCode &&
              error.code === ErrCode.AccountNotFound ? (
              <>Nobody goes by this name, on this platform</>
            ) : error instanceof ErrorWithCode &&
              error.code === ErrCode.InvalidAPIKey ? (
              <>Shit is broken, sorry</>
            ) : (
              <>
                Looks like the data aren&apos;t available right now. Try again
                later.
              </>
            )}
          </div>
        </Section>
      )}

      {!error && name && (
        <>
          <Section className="text-center text-xl font-black leading-inherit sm:text-4xl">
            <div className="animate-[levitate_3s_ease-in-out_infinite]">
              {isLoading || !data ? (
                <>
                  <Skeleton className="mx-auto mb-5 h-8 w-72 rounded-full sm:mb-7 sm:h-10 sm:w-96" />
                  <Skeleton className="mx-auto h-8 w-72 rounded-full sm:h-10 sm:w-1/2" />
                </>
              ) : (
                <>
                  {humanizeDuration(data.stats.all.overall.minutesPlayed)}{' '}
                  <br />
                  That&apos;s how long you&apos;ve spent in the game.
                </>
              )}
            </div>
          </Section>

          <Section>
            <MainData data={data} isLoading={isLoading} />
          </Section>

          <Section className="mb-16 md:mx-auto md:max-w-full">
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
