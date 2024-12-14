'use client';

import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { FaGamepad, FaKeyboard } from 'react-icons/fa';
import { FaUser, FaUserGroup, FaUsers } from 'react-icons/fa6';
import { GiSmartphone } from 'react-icons/gi';
import { TfiInfinite } from 'react-icons/tfi';

import { Data } from '#models/fortnite';
import { humanizeDuration, rateStr } from '#utils';

import { Pill } from './Pill';

type Category = 'all' | 'keyboardMouse' | 'gamepad' | 'touch';
const categoryList: Category[] = ['all', 'keyboardMouse', 'gamepad', 'touch'];

type TableEntry = {
  key: string;
  mode: string;
  icon: React.ReactNode;
  timePlayed: string;
  gamePlayed: number;
  wins: number;
  winRate: string;
  kd: string;
  top10rate: string;
  top25rate: string;
};

export const TableDesktop = ({
  data,
  isLoading,
}: {
  data?: Data;
  isLoading: boolean;
}) => {
  const [category, setCategory] = useState<Category>('all');

  // Sync the categories with the data, to make sure the current
  // category is available with the new set of data
  useEffect(() => {
    // The 'all' category is only going to be displayed if there is more than
    // one category available.
    const availableCats: Record<string, boolean> = {};

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

  // Create the categories pills
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

  const tableData = useMemo(() => {
    const out: TableEntry[] = [];

    const soloData = data?.stats[category]?.solo;
    if (soloData) {
      const solo = {
        key: crypto.randomUUID(),
        mode: 'Solo',
        icon: <FaUser />,
        timePlayed: humanizeDuration(soloData.minutesPlayed),
        gamePlayed: soloData.matches,
        wins: soloData.wins,
        winRate: rateStr(soloData.wins, soloData.matches),
        kd: (Math.ceil(soloData.kd * 100) / 100).toFixed(2),
        top10rate: rateStr(soloData.top10 ?? 0, soloData.matches),
        top25rate: rateStr(soloData.top25 ?? 0, soloData.matches),
      };
      out.push(solo);
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
        winRate: rateStr(duoData.wins, duoData.matches),
        kd: (Math.ceil(duoData.kd * 100) / 100).toFixed(2),
        top10rate: rateStr(duoData.top5 ?? 0, duoData.matches),
        top25rate: rateStr(duoData.top12 ?? 0, duoData.matches),
      };
      out.push(duo);
    }

    const squadData = data?.stats[category]?.squad;
    if (squadData) {
      const squad = {
        key: crypto.randomUUID(),
        mode: 'Trio / Squad',
        icon: <FaUsers />,
        timePlayed: humanizeDuration(squadData.minutesPlayed),
        gamePlayed: squadData.matches,
        wins: squadData.wins,
        winRate: rateStr(squadData.wins, squadData.matches),
        kd: (Math.ceil(squadData.kd * 100) / 100).toFixed(2),
        top10rate: rateStr(squadData.top3 ?? 0, squadData.matches),
        top25rate: rateStr(squadData.top6 ?? 0, squadData.matches),
      };
      out.push(squad);
    }
    const overallData = data?.stats[category]?.overall;
    // No need for the Overall category if there is only one category
    // available
    if (out.length !== 1 && overallData) {
      const overall = {
        key: crypto.randomUUID(),
        mode: 'Overall',
        icon: <TfiInfinite />,
        timePlayed: humanizeDuration(overallData.minutesPlayed),
        gamePlayed: overallData.matches,
        wins: overallData.wins,
        winRate: rateStr(overallData.wins, overallData.matches),
        kd: (Math.ceil(overallData.kd * 100) / 100).toFixed(2),
        top10rate: rateStr(
          (overallData.top3 ?? 0) +
            (overallData.top5 ?? 0) +
            (overallData.top10 ?? 0),
          overallData.matches,
        ),
        top25rate: rateStr(
          (overallData.top6 ?? 0) +
            (overallData.top12 ?? 0) +
            (overallData.top25 ?? 0),
          overallData.matches,
        ),
      };
      out.unshift(overall);
    }
    return out;
  }, [data, category]);

  return (
    <div className="flex flex-col items-center gap-11 sm:flex-row">
      <div className="hidden xl:block">
        <div className="flex flex-col gap-6">{TableCategoriesSection}</div>
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
          <TableColumn key="kd">
            <Tooltip
              closeDelay={0}
              delay={0}
              content="How many people you kill for each time you die"
            >
              <span>Kill/Death ratio</span>
            </Tooltip>
          </TableColumn>
          <TableColumn key="top10rate">
            <Tooltip
              closeDelay={0}
              delay={0}
              content="How often you are one of the last 10 players alive"
            >
              <span>Top 10% rate</span>
            </Tooltip>
          </TableColumn>
          <TableColumn key="top25rate">
            <Tooltip
              closeDelay={0}
              delay={0}
              content="How often you are one of the last 25 players alive"
            >
              <span>Top 25% rate</span>
            </Tooltip>
          </TableColumn>
          <TableColumn key="timePlayed">Time Played</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No data to display.'} items={tableData}>
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
  );
};
