import { Melvin } from '@/components/icons/Melvin';

export const Header = () => {
  return (
    <header className="flex w-full flex-col">
      <h1 className="mx-auto inline-flex items-center border-b-white pb-8 pl-28 pr-28 pt-0 text-3xl font-extrabold text-white sm:text-3xl lg:text-5xl">
        <span className="mr-12">
          <Melvin className="w-20 fill-white" />
        </span>
        <div className="uppercase">
          <span className="text-accent">MELVIN</span> <span>LAPLANCHE</span>
        </div>
      </h1>
      <div className="mx-auto my-0 text-center font-normal uppercase">
        FULL STACK ENGINEER WITH A LOVE FOR BACKEND AND SYSTEM DEV
      </div>
    </header>
  );
};
