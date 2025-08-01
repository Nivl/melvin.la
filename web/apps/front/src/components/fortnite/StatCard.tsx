import { Card, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { CircularProgress } from '@heroui/progress';
import { Skeleton } from '@heroui/skeleton';
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
  return (
    <Card
      {...delegated}
      className={twMerge(
        `h-[240px] w-[240px] border-none bg-linear-to-br from-violet-500 to-fuchsia-500 ${className}`,
      )}
    >
      <CardBody className="items-center justify-center pb-0">
        {isProgress ? (
          <CircularProgress
            classNames={{
              svg: 'w-36 h-36 drop-shadow-md',
              indicator: 'stroke-white',
              track: 'stroke-white/10',
              value: 'text-3xl font-semibold text-white',
            }}
            value={isLoading ? undefined : Number(stat) || ~~stat}
            strokeWidth={4}
            showValueLabel={true}
            aria-label="Current level progression"
          />
        ) : (
          <div className="text-center text-3xl font-extrabold text-white sm:text-4xl">
            <Skeleton className="light" isLoaded={!isLoading}>
              {stat}
            </Skeleton>
          </div>
        )}
      </CardBody>

      <CardFooter className="items-center justify-center pt-0">
        <Chip
          classNames={{
            base: 'border border-white/30',
            content: 'text-white/90 text-small font-semibold',
          }}
          variant="bordered"
        >
          {title}
        </Chip>
      </CardFooter>
    </Card>
  );
};
