import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import { Avatar } from '@nextui-org/react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export const StatCard = ({
  icon,
  iconSize = '',
  title,
  stat,
  className = '',
  isLoading = false,
  ...delegated
}: {
  title: string;
  iconSize?: string;
  icon: React.ReactNode;
  stat: string;
  className?: string;
  isLoading?: boolean;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Card
      onMouseMove={handleMouseMove}
      {...delegated}
      className={twMerge(
        `group relative w-80 bg-neutral-950 sm:w-72 lg:w-80 ${className}`,
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              100px circle at ${mouseX}px ${mouseY}px,
              #FF1CF726,
              transparent 80%
            )
          `,
        }}
      />
      <CardHeader className="flex flex-row gap-4">
        <Avatar
          icon={icon}
          classNames={{
            base: 'bg-violet-950 bg-opacity-80',
            icon: `text-pink-500 text-[20px] ${iconSize}`,
          }}
        />
        <p className="text-base font-semibold">{title}</p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center justify-center pb-8">
          <div className="text-center text-3xl font-black sm:text-4xl">
            <Skeleton isLoaded={!isLoading}>{stat}</Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
