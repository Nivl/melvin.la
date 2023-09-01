import { Melvin } from '@/components/icons/Melvin';

export const Header = () => {
  return (
    <header className="flex w-full flex-col">
      <h1 className="mx-auto inline-flex w-full items-center justify-center border-b-white pb-8 pt-0 text-2xl font-extrabold text-white sm:w-auto sm:px-16 sm:pb-4 sm:text-4xl xl:px-28 xl:pb-8 xl:text-5xl">
        <span className="mr-6 sm:mr-8 xl:mr-12">
          <Melvin className="w-16 fill-white sm:w-14 xl:w-20" />
        </span>
        <div className="flex flex-col text-center uppercase sm:block sm:text-left">
          <span className="text-accent">MELVIN</span> <span>LAPLANCHE</span>
        </div>
      </h1>
      <div className="mx-auto my-0 text-center text-sm font-normal uppercase sm:text-base xl:text-xl">
        FULL STACK ENGINEER WITH A LOVE FOR BACKEND AND SYSTEM DEV
      </div>
    </header>
  );
};
