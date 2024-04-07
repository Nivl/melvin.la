import { Card, CardHeader, Skeleton } from '@nextui-org/react';
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

  return (
    <Card
      onMouseMove={handleMouseMove}
      {...delegated}
      onPress={!isLoading ? onPress : () => {}}
      className={twMerge(
        `group relative w-72 bg-neutral-950 text-pink-500 ${isSelected ? 'bg-violet-950 bg-opacity-40' : 'bg-neutral-950'} ${className}`,
      )}
      isPressable={!isLoading}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              50px circle at ${mouseX}px ${mouseY}px,
              #FF1CF726,
              transparent 80%
            )
          `,
        }}
      />
      <CardHeader className="text-start text-base font-semibold text-foreground">
        <Skeleton isLoaded={!isLoading}>{icon}</Skeleton>
        <Skeleton className="m-auto w-48" isLoaded={!isLoading}>
          <p>{title}</p>
        </Skeleton>
      </CardHeader>
    </Card>
  );
};
