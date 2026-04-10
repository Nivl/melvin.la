"use client";

import { Table, Tooltip } from "@heroui/react";
import { BadgeInfo } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FaGamepad, FaKeyboard } from "react-icons/fa";
import { FaUser, FaUserGroup, FaUsers } from "react-icons/fa6";
import { GiSmartphone } from "react-icons/gi";
import { TfiInfinite } from "react-icons/tfi";

import { type FortniteData } from "#backend/api";
import { humanizeDuration, rateStr } from "#features/fortnite/utils.ts";

import { Pill } from "./Pill";

type Category = "all" | "keyboardMouse" | "gamepad" | "touch";
const categoryList: Category[] = ["all", "keyboardMouse", "gamepad", "touch"];

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
  tooltipInfo?: string;
};

export const TableDesktop = ({ data, isLoading }: { data?: FortniteData; isLoading: boolean }) => {
  const [category, setCategory] = useState<Category>("all");
  const rootT = useTranslations();
  const t = useTranslations("fortnite.data");

  // We need to sync the categories with the data, to make sure the
  // current category is available with the new set of data
  const [prevData, setPrevData] = useState<FortniteData | undefined>();
  if (data !== prevData) {
    setPrevData(data);

    // The 'all' category is only going to be displayed if there is more than
    // one category available.
    const availableCats = categoryList.filter(
      (cat): cat is Exclude<Category, "all"> => cat !== "all" && !!data?.stats[cat]?.overall,
    );

    // if the current category is not available for the current set of data
    // we switch to either 'all' or to the only available category
    const categoryIsAvailable =
      category === "all" ? availableCats.length !== 1 : availableCats.includes(category);

    if (!categoryIsAvailable) {
      const newCat = availableCats.length === 1 ? availableCats[0] : "all";
      setCategory(newCat);
    }
  }

  // Create the categories pills
  const TableCategoriesSection = useMemo(() => {
    const categories = [];
    // When loading we show everything, which will then be replaced by
    // the loader
    if (isLoading || data?.stats.keyboardMouse?.overall) {
      categories.push({
        key: "score-keyboard",
        title: t("kbm"),
        selected: category === "keyboardMouse",
        icon: <FaKeyboard />,
        isLoading,
        onCick: () => {
          setCategory("keyboardMouse");
        },
      });
    }
    if (isLoading || data?.stats.gamepad?.overall) {
      categories.push({
        key: "score-gamepad",
        title: t("gamepad"),
        icon: <FaGamepad />,
        selected: category === "gamepad",
        isLoading,
        onCick: () => {
          setCategory("gamepad");
        },
      });
    }
    if (isLoading || data?.stats.touch?.overall) {
      categories.push({
        key: "score-mobile",
        title: t("mobile"),
        selected: category === "touch",
        icon: <GiSmartphone />,
        isLoading,
        onCick: () => {
          setCategory("touch");
        },
      });
    }

    // If we have more than one cat (or 0) we'll add the 'all' category
    if (categories.length !== 1) {
      categories.unshift({
        key: "score-all",
        title: t("all-categories"),
        selected: category === "all",
        icon: <TfiInfinite />,
        isLoading,
        onCick: () => {
          setCategory("all");
        },
      });
    }

    return categories.map((e) => {
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
  }, [data, category, isLoading, t]);

  const tableData = useMemo(() => {
    const out: TableEntry[] = [];

    const soloData = data?.stats[category]?.solo;
    if (soloData) {
      const solo = {
        key: crypto.randomUUID(),
        mode: t("solo"),
        tooltipInfo: t("soloTooltipInfo"),
        icon: <FaUser />,
        timePlayed: humanizeDuration(rootT, soloData.minutesPlayed),
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
        mode: t("duo"),
        tooltipInfo: t("duoTooltipInfo"),
        icon: <FaUserGroup />,
        timePlayed: humanizeDuration(rootT, duoData.minutesPlayed),
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
        mode: t("squad"),
        tooltipInfo: t("squadTooltipInfo"),
        icon: <FaUsers />,
        timePlayed: humanizeDuration(rootT, squadData.minutesPlayed),
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
        tooltipInfo: t("overallTooltipInfo"),
        key: crypto.randomUUID(),
        mode: t("overall"),
        icon: <TfiInfinite />,
        timePlayed: humanizeDuration(rootT, overallData.minutesPlayed),
        gamePlayed: overallData.matches,
        wins: overallData.wins,
        winRate: rateStr(overallData.wins, overallData.matches),
        kd: (Math.ceil(overallData.kd * 100) / 100).toFixed(2),
        top10rate: rateStr(
          (overallData.top3 ?? 0) + (overallData.top5 ?? 0) + (overallData.top10 ?? 0),
          overallData.matches,
        ),
        top25rate: rateStr(
          (overallData.top6 ?? 0) + (overallData.top12 ?? 0) + (overallData.top25 ?? 0),
          overallData.matches,
        ),
      };
      out.unshift(overall);
    }
    return out;
  }, [data, category, t, rootT]);

  return (
    <div className="border-divider flex flex-col items-center gap-11 sm:flex-row">
      <div className="hidden xl:block">
        <div className="flex flex-col gap-6">{TableCategoriesSection}</div>
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={t("statsTable")}>
            <Table.Header>
              <Table.Column isRowHeader>{""}</Table.Column>
              <Table.Column>{t("gamePlayed")}</Table.Column>
              <Table.Column>{t("wins")}</Table.Column>
              <Table.Column>{t("winRate")}</Table.Column>
              <Table.Column>
                <Tooltip delay={0}>
                  <Tooltip.Trigger>
                    <span className="cursor-help">{t("kd")}</span>
                  </Tooltip.Trigger>
                  <Tooltip.Content offset={12} showArrow className="bg-default-900 rounded p-2">
                    {t("kdHelp")}
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip>
              </Table.Column>
              <Table.Column>
                <Tooltip delay={0}>
                  <Tooltip.Trigger>
                    <span className="cursor-help">{t("top10rate")}</span>
                  </Tooltip.Trigger>
                  <Tooltip.Content offset={12} showArrow className="bg-default-900 rounded p-2">
                    {t("top10rateHelp")}
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip>
              </Table.Column>
              <Table.Column>
                <Tooltip delay={0}>
                  <Tooltip.Trigger>
                    <span className="cursor-help">{t("top25rate")}</span>
                  </Tooltip.Trigger>
                  <Tooltip.Content offset={12} showArrow className="bg-default-900 rounded p-2">
                    {t("top25rateHelp")}
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip>
              </Table.Column>
              <Table.Column>{t("timePlayed")}</Table.Column>
            </Table.Header>
            <Table.Body
              items={tableData}
              renderEmptyState={() => <div className="m-auto w-fit">{t("noData")}</div>}
            >
              {(item) => (
                <Table.Row id={item.key}>
                  <Table.Cell>
                    <div className="flex flex-row items-center gap-2">
                      {item.icon}
                      {item.mode}
                      {item.tooltipInfo && (
                        <Tooltip delay={0}>
                          <Tooltip.Trigger>
                            <BadgeInfo className="h-3 w-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                          </Tooltip.Trigger>
                          <Tooltip.Content
                            offset={12}
                            showArrow
                            className="bg-default-900 rounded p-2"
                          >
                            {item.tooltipInfo}
                            <Tooltip.Arrow />
                          </Tooltip.Content>
                        </Tooltip>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{item.gamePlayed}</Table.Cell>
                  <Table.Cell>{item.wins}</Table.Cell>
                  <Table.Cell>{item.winRate}</Table.Cell>
                  <Table.Cell>{item.kd}</Table.Cell>
                  <Table.Cell>{item.top10rate}</Table.Cell>
                  <Table.Cell>{item.top25rate}</Table.Cell>
                  <Table.Cell>{item.timePlayed}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
};
