'use client';
import {
  getKeyValue,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { FaGamepad, FaKeyboard, FaUser } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { GiSmartphone } from 'react-icons/gi';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { LiaSkullSolid } from 'react-icons/lia';
import { TfiCup, TfiInfinite } from 'react-icons/tfi';

import { Section } from '@/components/Home/Section';
import { ErrorWithCode } from '@/error';
import { ErrCode, useStats } from '@/hooks/fortnite/useStats';

import { AccountTypes, Form, TimeWindow } from './Form';
import { Pill } from './Pill';
import { StatCard } from './StatCard';

type Category = 'all' | 'keyboardMouse' | 'gamepad' | 'touch';
const categoryList: Category[] = ['all', 'keyboardMouse', 'gamepad', 'touch'];

type TableData = {
  desktop: TableEntry[];
  mobile: {
    solo?: TableEntry;
    duo?: TableEntry;
    squad?: TableEntry;
    overall?: TableEntry;
  };
};

type TableEntry = {
  key: string;
  mode: string;
  icon: React.ReactNode;
  timePlayed: string;
  gamePlayed: number;
  wins: number;
  winRate: string;
  kd: string;
  top10ratio: string;
  top25ratio: string;
};

// Return of much % of $value is from $total
const rate = (value: number, total: number) => {
  if (total === 0) {
    return value;
  }
  const rate = total ? (value / total) * 100 : 0;
  return Math.ceil(rate * 100) / 100;
};

// convert minutes to human readable duration
const humanizeDuration = (minutes: number) => {
  let output = '';
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  if (d > 0) {
    output += `${d} day${d > 1 ? 's' : ''} `;
  }
  if (h > 0) {
    output += `${h} hour${h > 1 ? 's' : ''} `;
  }
  if (m > 0) {
    output += `${m} minute${m > 1 ? 's' : ''} `;
  }
  return output;
};

const defaults = {
  accountName: '',
  accountType: AccountTypes.Epic,
  timeWindow: TimeWindow.Lifetime,
};

export const Stats = () => {
  const [name, setName] = useState(defaults.accountName);
  const [accountType, setAccountType] = useState(defaults.accountType);
  const [timeWindow, setTimeWindow] = useState(defaults.timeWindow);
  const [category, setCategory] = useState<Category>('all');

  const { data, error, isLoading } = useStats(name, accountType, timeWindow);

  const TableCategoriesSection = useMemo(() => {
    const categories = [];
    // When loading we show everything, which will then be replaced by
    // the loader
    if (isLoading || data?.stats.keyboardMouse?.overall) {
      categories.push({
        key: 'score-keyboard',
        title: 'Keyboard / Mouse',
        selected: category === 'keyboardMouse',
        icon: <FaKeyboard />,
        isLoading,
        onCick: () => {
          setCategory('keyboardMouse');
        },
      });
    }
    if (isLoading || data?.stats.gamepad?.overall) {
      categories.push({
        key: 'score-gamepad',
        title: 'Gamepad',
        icon: <FaGamepad />,
        selected: category === 'gamepad',
        isLoading,
        onCick: () => {
          setCategory('gamepad');
        },
      });
    }
    if (isLoading || data?.stats.touch?.overall) {
      categories.push({
        key: 'score-mobile',
        title: 'Mobile',
        selected: category === 'touch',
        icon: <GiSmartphone />,
        isLoading,
        onCick: () => {
          setCategory('touch');
        },
      });
    }

    // If we have more than one cat (or 0) we'll add the 'all' category
    if (categories.length !== 1) {
      categories.unshift({
        key: 'score-all',
        title: 'All',
        selected: category === 'all',
        icon: <TfiInfinite />,
        isLoading,
        onCick: () => {
          setCategory('all');
        },
      });
    }

    return categories.map(e => {
      return (
        <Pill
          key={e.key}
          icon={e.icon}
          title={e.title}
          onPress={e.onCick}
          isSelected={e.selected}
          isLoading={e.isLoading}
        />
      );
    });
  }, [data, category, isLoading]);

  // Sync the category with the data
  useEffect(() => {
    // The 'all' category is only going to be displayed if there is more than
    // one category available.
    const availableCats: { [key: string]: boolean } = {};

    categoryList.forEach(e => {
      if (e !== 'all' && data?.stats[e]?.overall) {
        availableCats[e] = true;
      }
    });

    // if the current category is not available for the current set of data
    // we switch to either 'all' or to the only available category
    if (!availableCats[category]) {
      const newCat =
        Object.keys(availableCats).length === 1
          ? (Object.keys(availableCats)[0] as Category)
          : 'all';

      setCategory(newCat);
    }
  }, [data, category]);

  const tableData = useMemo(() => {
    const out: TableData = {
      desktop: [],
      mobile: {},
    };
    const soloData = data?.stats[category]?.solo;
    if (soloData) {
      const solo = {
        key: crypto.randomUUID(),
        mode: 'Solo',
        icon: <FaUser />,
        timePlayed: humanizeDuration(soloData.minutesPlayed),
        gamePlayed: soloData.matches,
        wins: soloData.wins,
        winRate: `${rate(soloData.wins, soloData.matches)}%`,
        kd: `${Math.ceil(soloData.kd * 100) / 100}`,
        top10ratio: `${rate(soloData.top10 || 0, soloData.matches)}%`,
        top25ratio: `${rate(soloData.top25 || 0, soloData.matches)}%`,
      };
      out.mobile.solo = solo;
      out.desktop.push(solo);
    }
    const duoData = data?.stats[category]?.duo;
    if (duoData) {
      const duo = {
        key: crypto.randomUUID(),
        mode: 'Duo',
        icon: <FaUserGroup />,
        timePlayed: humanizeDuration(duoData.minutesPlayed),
        gamePlayed: duoData.matches,
        wins: duoData.wins,
        winRate: `${rate(duoData.wins, duoData.matches)}%`,
        kd: `${Math.ceil(duoData.kd * 100) / 100}`,
        top10ratio: `${rate(duoData.top5 || 0, duoData.matches)}%`,
        top25ratio: `${rate(duoData.top12 || 0, duoData.matches)}%`,
      };
      out.mobile.duo = duo;
      out.desktop.push(duo);
    }
    const squadData = data?.stats[category]?.squad;
    if (squadData) {
      const squad = {
        key: crypto.randomUUID(),
        mode: 'Trio / Squad',
        icon: <HiMiniUserGroup />,
        timePlayed: humanizeDuration(squadData.minutesPlayed),
        gamePlayed: squadData.matches,
        wins: squadData.wins,
        winRate: `${rate(squadData.wins, squadData.matches)}%`,
        kd: `${Math.ceil(squadData.kd * 100) / 100}`,
        top10ratio: `${rate(squadData.top3 || 0, squadData.matches)}%`,
        top25ratio: `${rate(squadData.top6 || 0, squadData.matches)}%`,
      };
      out.mobile.squad = squad;
      out.desktop.push(squad);
    }
    const overallData = data?.stats[category]?.overall;
    // No need for the Overall category if there is only one category
    // available
    if (out.desktop.length !== 1 && overallData) {
      const overall = {
        key: crypto.randomUUID(),
        mode: 'Overall',
        icon: <TfiInfinite />,
        timePlayed: humanizeDuration(overallData.minutesPlayed),
        gamePlayed: overallData.matches,
        wins: overallData.wins,
        winRate: `${rate(overallData.wins, overallData.matches)}%`,
        kd: `${Math.ceil(overallData.kd * 100) / 100}`,
        top10ratio: `${rate(
          (overallData.top3 || 0) +
            (overallData.top5 || 0) +
            (overallData.top10 || 0),
          overallData.matches,
        )}%`,
        top25ratio: `${rate(
          (overallData.top6 || 0) +
            (overallData.top12 || 0) +
            (overallData.top25 || 0),
          overallData.matches,
        )}%`,
      };
      out.mobile.overall = overall;
      out.desktop.unshift(overall);
    }
    return out;
  }, [data, category]);

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
            <div className="flex flex-col items-center justify-evenly gap-10 sm:flex-row sm:gap-0">
              <StatCard
                icon={<TfiCup />}
                iconSize="text-[20px]"
                title="Win Rate"
                isLoading={isLoading || !data}
                stat={
                  data
                    ? `${rate(
                        data.stats.all.overall.wins,
                        data.stats.all.overall.matches,
                      )} %`
                    : '0.00%'
                }
              />
              <StatCard
                icon={<LiaSkullSolid />}
                iconSize="text-[32px]"
                title="Kill / Death ratio"
                isLoading={isLoading || !data}
                stat={
                  data
                    ? `${Math.ceil(data.stats.all.overall.kd * 100) / 100}`
                    : '0.00'
                }
              />
            </div>
          </Section>

          <Section className="mb-16 md:mx-auto md:max-w-full">
            {/* Desktop only */}
            <div className="hidden sm:block">
              <div className="flex flex-col items-center gap-11 sm:flex-row">
                <div className="hidden xl:block">
                  <div className="flex flex-col gap-6">
                    {TableCategoriesSection}
                  </div>
                </div>
                <Table
                  aria-label="Table with all the stats"
                  removeWrapper
                  classNames={{
                    th: 'bg-transparent text-default-500 border-b border-divider',
                  }}
                >
                  <TableHeader>
                    <TableColumn key="mode">{''}</TableColumn>
                    <TableColumn key="gamePlayed">Game Played</TableColumn>
                    <TableColumn key="wins">Wins</TableColumn>
                    <TableColumn key="winRate">Win Rate</TableColumn>
                    <TableColumn key="kd">Kill/Death rate</TableColumn>
                    <TableColumn key="top10ratio">Top 10% rate</TableColumn>
                    <TableColumn key="top25ratio">Top 25% ratio</TableColumn>
                    <TableColumn key="timePlayed">Time Played</TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent={'No data to display.'}
                    items={tableData.desktop}
                  >
                    {item => (
                      <TableRow key={item.key}>
                        {columnKey => (
                          <TableCell>
                            {columnKey === 'mode' ? (
                              <div className="flex flex-row items-center gap-2">
                                {item.icon}
                                {getKeyValue(item, columnKey)}
                              </div>
                            ) : (
                              getKeyValue(item, columnKey)
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Mobile / small screen only */}
            <div className="sm:hidden">
              {(isLoading || tableData.mobile.solo) && (
                <>
                  <h3 className="mb-3 flex items-center gap-3">
                    <FaUser /> <span>Solo Stats</span>
                  </h3>
                  <Table
                    className="mb-10 text-center"
                    hideHeader
                    aria-label="Solo stats"
                    isStriped
                  >
                    <TableHeader>
                      <TableColumn>Stat</TableColumn>
                      <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading}>
                      <TableRow>
                        <TableCell>Game Played</TableCell>
                        <TableCell>
                          {tableData.mobile.solo?.gamePlayed}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Wins</TableCell>
                        <TableCell>{tableData.mobile.solo?.wins}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Win Rate</TableCell>
                        <TableCell>{tableData.mobile.solo?.winRate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Kill/Death rate</TableCell>
                        <TableCell>{tableData.mobile.solo?.kd}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top 10% rate</TableCell>
                        <TableCell>
                          {tableData.mobile.solo?.top10ratio}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top 25% ratio</TableCell>
                        <TableCell>
                          {tableData.mobile.solo?.top25ratio}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Time Played</TableCell>
                        <TableCell>
                          {tableData.mobile.solo?.timePlayed}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              )}
              {(isLoading || tableData.mobile.duo) && (
                <>
                  <h3 className="mb-3 flex items-center gap-3">
                    <FaUserGroup /> <span>Duo Stats</span>
                  </h3>
                  <Table
                    hideHeader
                    aria-label="Duo stats"
                    className="mb-10 text-center"
                    isStriped
                  >
                    <TableHeader>
                      <TableColumn>Stat</TableColumn>
                      <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading}>
                      <TableRow>
                        <TableCell>Game Played</TableCell>
                        <TableCell>
                          {tableData.mobile.duo?.gamePlayed}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Wins</TableCell>
                        <TableCell>{tableData.mobile.duo?.wins}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Win Rate</TableCell>
                        <TableCell>{tableData.mobile.duo?.winRate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Kill/Death rate</TableCell>
                        <TableCell>{tableData.mobile.duo?.kd}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top 10% rate</TableCell>
                        <TableCell>
                          {tableData.mobile.duo?.top10ratio}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top 25% ratio</TableCell>
                        <TableCell>
                          {tableData.mobile.duo?.top25ratio}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Time Played</TableCell>
                        <TableCell>
                          {tableData.mobile.duo?.timePlayed}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              )}
              {(isLoading || tableData.mobile.squad) && (
                <>
                  <h3 className="mb-3 flex items-center gap-3">
                    <HiMiniUserGroup /> <span>Trio / Squad Stats</span>
                  </h3>
                  <Table
                    className="text-center"
                    hideHeader
                    aria-label="Trio / Squad stats"
                    isStriped
                  >
                    <TableHeader>
                      <TableColumn>Stat</TableColumn>
                      <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading}>
                      <TableRow>
                        <TableCell>Game Played</TableCell>
                        <TableCell>
                          {tableData.mobile.squad?.gamePlayed}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Wins</TableCell>
                        <TableCell>{tableData.mobile.squad?.wins}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Win Rate</TableCell>
                        <TableCell>{tableData.mobile.squad?.winRate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Kill/Death rate</TableCell>
                        <TableCell>{tableData.mobile.squad?.kd}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top 10% rate</TableCell>
                        <TableCell>
                          {tableData.mobile.squad?.top10ratio}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Top 25% ratio</TableCell>
                        <TableCell>
                          {tableData.mobile.squad?.top25ratio}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Time Played</TableCell>
                        <TableCell>
                          {tableData.mobile.squad?.timePlayed}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          </Section>
        </>
      )}
    </>
  );
};
