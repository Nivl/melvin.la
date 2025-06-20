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

  let classname =
    'pb-2 md:pb-4 xl:pb-5 leading-none font-bold bg-gradient-to-b from-accent to-[#32c2ff] dark:to-[#066e9a] bg-clip-text text-transparent';

  switch (level) {
    case 1:
      classname = `mb-5 pb-5 text-center text-3xl font-black uppercase`;
      break;
    case 2:
      classname = `${classname} uppercase text-xl md:text-2xl xl:text-3xl border-b-accent border-solid border-b mb-2 md:mb-4 xl:mb-5`;
      break;
    case 3:
      classname = `${classname} uppercase text-lg md:text-xl xl:text-2xl`;
      break;
    case 4:
      classname = `${classname} uppercase text-md md:text-lg xl:text-xl`;
      break;
    case 5:
      classname = `${classname} uppercase text-sm md:text-md xl:text-lg`;
      break;
    case 6:
      classname = `${classname} uppercase text-xs md:text-sm xl:text-md`;
      break;
  }

  return createElement(
    `h${level.toString()}`,
    {
      className: twMerge(`${classname} ${className ?? ''}`),
    },
    children,
  );
};
