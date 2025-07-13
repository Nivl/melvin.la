import { Melvin } from '#components/icons/Melvin';

import { Heading } from '../layout/Heading';

export const Header = () => {
  return (
    <header className="flex w-full flex-col">
      <Heading
        level={1}
        className="font-condensed xl:leading-tight-xl leading-tight-xs sm:leading-tight-sm mx-auto inline-flex w-full items-center justify-center border-b-foreground pb-8 pt-0 text-6xl font-normal sm:w-auto sm:px-16 sm:pb-4 sm:text-8xl xl:px-28 xl:pb-8 xl:text-9xl"
      >
        <span className="mr-6 sm:mr-8 xl:mr-12">
          <Melvin className="w-24 fill-neutral-700 drop-shadow-lg dark:fill-foreground sm:w-28 xl:w-36" />
        </span>
        <div className="flex flex-col uppercase">
          <span>MELVIN</span> <span className="text-foreground">LAPLANCHE</span>
        </div>
      </Heading>
      <div className="mx-auto my-0 text-center text-sm font-normal uppercase sm:text-base xl:text-xl">
        FULL STACK ENGINEER WITH A LOVE FOR BACKEND AND SYSTEM DEV
      </div>
    </header>
  );
};
