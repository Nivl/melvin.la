import type { Metadata } from "next";
import { use } from "react";

import { Home } from "#features/home/components/home";
import db from "#features/home/db.json";
// The current alternative doesn't work well yet
// eslint-disable-next-line no-deprecated
import { setRequestLocale } from "#next-intl-server";
import { getMetadata } from "#shared/utils/metadata";

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  // Opt into static rendering: without this, next-intl reads request
  // headers to resolve the locale, which forces the route dynamic.
  //
  // The current alternative doesn't work well yet
  // eslint-disable-next-line no-deprecated
  setRequestLocale(locale);

  return <Home sections={db.sections} />;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return await getMetadata({
    locale,
  });
};
