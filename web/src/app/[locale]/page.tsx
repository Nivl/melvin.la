import type { Metadata } from "next";

import { Home } from "#features/home/components/Home";
import db from "#features/home/db.json";
import { getMetadata } from "#shared/utils/metadata";

export default function Page() {
  return <Home sections={db.sections} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return await getMetadata({
    locale,
  });
}
