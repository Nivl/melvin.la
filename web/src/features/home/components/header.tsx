import { useTranslations } from "next-intl";

import { Boba } from "#features/home/components/icons/boba.tsx";
import { Heading } from "#shared/components/layout/heading";

export const Header = () => {
  const t = useTranslations("home.header");

  return (
    <header className="flex w-full flex-col">
      <Heading
        level={1}
        className="mx-auto inline-flex w-full items-center justify-center border-b-foreground pt-0 pb-8 font-condensed-latin text-6xl leading-tight-xs font-normal sm:w-auto sm:px-16 sm:pb-4 sm:text-8xl sm:leading-tight-sm xl:px-28 xl:pb-8 xl:text-9xl xl:leading-tight-xl"
      >
        <span className="mr-6 sm:mr-8 xl:mr-12">
          <Boba className="h-24 w-24 cursor-pointer text-foreground sm:h-28 sm:w-28 xl:h-36 xl:w-36" />
        </span>
        <div className="flex flex-col uppercase">
          <span className="select-none">MELVIN</span>{" "}
          <span className="text-foreground duration-150 select-none">LAPLANCHE</span>
        </div>
      </Heading>
      <div className="mx-auto my-0 text-center text-sm font-normal uppercase sm:text-base xl:text-xl">
        {t("subtitle")}
      </div>
    </header>
  );
};
