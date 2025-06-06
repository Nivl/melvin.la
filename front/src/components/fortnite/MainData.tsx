import { type FortniteData } from '#backend/api';
import { rate } from '#utils';

import { StatCard } from './StatCard';

export const MainData = ({
  data,
  isLoading,
}: {
  data?: FortniteData;
  isLoading: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-evenly gap-14 sm:flex-row md:gap-10">
      <StatCard
        className="from-[#4ADE80] to-[#06B6D4]"
        title="Overall win rate"
        isLoading={isLoading || !data}
        stat={
          data
            ? `${rate(
                data.stats.all.overall.wins,
                data.stats.all.overall.matches,
              ).toFixed(2)}%`
            : '0.00%'
        }
      />
      <StatCard
        className="from-[#FFB457] to-[#FF705B]"
        title="Overall Kill / Death ratio"
        isLoading={isLoading || !data}
        stat={
          data
            ? (Math.ceil(data.stats.all.overall.kd * 100) / 100).toFixed(2)
            : '0.00'
        }
      />
      <StatCard
        className="from-[#FF72E1] to-[#F54C7A]"
        title={`Level ${(data?.battlePass.level ?? 1).toString()}`}
        isLoading={isLoading || !data}
        stat={data?.battlePass.progress ?? 0}
        isProgress
      />
    </div>
  );
};
