import { Boba } from '#components/icons/Boba.tsx';

import { Heading } from '../layout/Heading';

export const Header = () => {
  return (
    <header className="flex w-full flex-col">
      <Heading
        level={1}
        className="border-b-foreground font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl mx-auto inline-flex w-full items-center justify-center pt-0 pb-8 text-6xl font-normal sm:w-auto sm:px-16 sm:pb-4 sm:text-8xl xl:px-28 xl:pb-8 xl:text-9xl"
      >
        <span className="mr-6 sm:mr-8 xl:mr-12">
          <Boba className="text-foreground h-24 w-24 cursor-pointer sm:h-28 sm:w-28 xl:h-36 xl:w-36" />
        </span>
        <div className="flex flex-col uppercase">
          <span className="select-none">MELVIN</span>{' '}
          <span className="text-foreground duration-150 select-none">
            LAPLANCHE
          </span>
        </div>
      </Heading>
      <div className="mx-auto my-0 text-center text-sm font-normal uppercase sm:text-base xl:text-xl">
        FULL STACK ENGINEER WITH A LOVE FOR BACKEND AND SYSTEM DEV
      </div>
    </header>
  );
};
