import { Card, CardHeader } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export const Pill = ({
  icon,
  title,
  onPress,
  isSelected = false,
  className = '',
  isLoading = false,
  ...delegated
}: {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  className?: string;
  isSelected?: boolean;
  isLoading?: boolean;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      50px circle at ${mouseX}px ${mouseY}px,
      #1c5bff25,
      transparent 80%
    )
  `;

  return (
    <Card
      onMouseMove={handleMouseMove}
      {...delegated}
      onPress={
        !isLoading && !isSelected
          ? onPress
          : () => {
              // do nothing
            }
      }
      className={twMerge(
        `group relative w-72 dark:bg-neutral-950 ${isSelected ? 'bg-linear-to-br from-[#2753ad] to-[#418eff] dark:to-[#052d67]' : 'border border-neutral-200 dark:border-neutral-800'} ${className}`,
      )}
      isPressable={!isLoading}
    >
      {!isSelected && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{ background }}
        />
      )}
      <CardHeader
        className={`dark:text-foreground h-12 text-start text-base font-semibold ${isSelected ? 'text-white' : ''}`}
      >
        <Skeleton isLoaded={!isLoading}>{icon}</Skeleton>
        <Skeleton
          className={`m-auto w-48 ${isSelected ? 'light' : 'dark'}`}
          isLoaded={!isLoading}
        >
          <p>{title}</p>
        </Skeleton>
      </CardHeader>
    </Card>
  );
};
