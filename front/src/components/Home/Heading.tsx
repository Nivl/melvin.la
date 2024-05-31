import { createElement } from 'react';
import { twMerge } from 'tailwind-merge';

export const Heading = ({
  level,
  className,
  children,
}: {
  level: number;
  className?: string;
  children?: React.ReactNode;
}) => {
  if (level < 1 || level > 6) {
    throw new Error('Invalid heading level');
  }

  const classname = `border-b-accent border-solid border-b pb-2 mb-2 md:pb-4 md:mb-4 xl:pb-5 xl:mb-5 leading-none font-bold bg-gradient-to-b from-accent to-[#32c2ff] dark:to-[#066e9a] bg-clip-text text-transparent ${level === 2 ? 'uppercase text-xl md:text-2xl xl:text-3xl' : ''}`;

  return createElement(
    `h${level}`,
    {
      className: twMerge(`${classname} ${className}`),
    },
    children,
  );
};
