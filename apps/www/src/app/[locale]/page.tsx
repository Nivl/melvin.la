import type { Metadata } from "next";

import { Home } from "#features/home/components/home";
import db from "#features/home/db.json";
import { getMetadata } from "#shared/utils/metadata";

export default function Page() {
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
