import { LiaSkullSolid } from 'react-icons/lia';
import { TfiCup } from 'react-icons/tfi';

import { Data } from '@/models/fortnite';
import { rate } from '@/utils';

import { StatCard } from './StatCard';

export const MainData = ({
  data,
  isLoading,
}: {
  data?: Data;
  isLoading: boolean;
}) => {
  return (
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
          data ? `${Math.ceil(data.stats.all.overall.kd * 100) / 100}` : '0.00'
        }
      />
    </div>
  );
};
