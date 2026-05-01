import { useTranslations } from "next-intl";

import { FortniteStatsData, hasStats } from "#features/fortnite/models";
import { rate } from "#features/fortnite/utils.ts";

import { StatCard } from "./stat-card";

export const MainData = ({ data, isLoading }: { data?: FortniteStatsData; isLoading: boolean }) => {
  const t = useTranslations("fortnite");

  return (
    <div className="flex flex-col items-center justify-evenly gap-14 sm:flex-row md:gap-10">
      <StatCard
        className="from-[#4ADE80] to-[#06B6D4]"
        title={t("overallWinRate")}
        isLoading={isLoading || !hasStats(data)}
        stat={
          hasStats(data)
            ? `${rate(data.stats.all.overall.wins, data.stats.all.overall.matches).toFixed(2)}%`
            : "0.00%"
        }
      />
      <StatCard
        className="from-[#FFB457] to-[#FF705B]"
        title={t("overallKd")}
        isLoading={isLoading || !hasStats(data)}
        stat={
          hasStats(data) ? (Math.ceil(data.stats.all.overall.kd * 100) / 100).toFixed(2) : "0.00"
        }
      />
      <StatCard
        className="from-[#FF72E1] to-[#F54C7A]"
        title={t("currentLevel", {
          level: (data?.battlePass.level ?? 1).toString(),
        })}
        isLoading={isLoading || !data}
        stat={data?.battlePass.progress ?? 0}
        isProgress
      />
    </div>
  );
};
