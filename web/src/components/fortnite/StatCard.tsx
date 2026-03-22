import { Card, Chip, ProgressCircle, Skeleton } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export const StatCard = ({
  isProgress = false,
  title,
  stat,
  className = '',
  isLoading = false,
  ...delegated
}: {
  title: string;
  isProgress?: boolean;
  stat: string | number;
  className?: string;
  isLoading?: boolean;
}) => {
  const t = useTranslations('fortnite');

  return (
    <Card
      {...delegated}
      className={twMerge(
        `h-[240px] w-60 border-none bg-linear-to-br from-violet-500 to-fuchsia-500 ${className}`,
      )}
    >
      <Card.Content className="items-center justify-center pb-0">
        {isProgress ? (
          <>
            <ProgressCircle
              size="lg"
              aria-label={t('currentLevelProgression')}
              value={isLoading ? undefined : Number(stat) || ~~stat}
              className="h-31 w-31"
              isIndeterminate={isLoading}
            >
              <ProgressCircle.Track className="h-30 w-30 drop-shadow-md">
                <ProgressCircle.TrackCircle className="stroke-white/10" />
                <ProgressCircle.FillCircle className="stroke-white" />
              </ProgressCircle.Track>
            </ProgressCircle>
            <span className="absolute flex items-center justify-center text-3xl font-bold text-white">
              {isLoading ? (
                <Skeleton className="light h-8 w-10" />
              ) : (
                `${stat.toString()}%`
              )}
            </span>
          </>
        ) : (
          <div className="text-center text-3xl font-extrabold text-white sm:text-4xl">
            {isLoading ? <Skeleton className="light h-8 w-32" /> : stat}
          </div>
        )}
      </Card.Content>

      <Card.Footer className="items-center justify-center pt-0">
        <Chip
          size="lg"
          className="border border-white/30 text-sm font-bold text-white/90"
          variant="tertiary"
        >
          <span>{title}</span>
        </Chip>
      </Card.Footer>
    </Card>
  );
};
