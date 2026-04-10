import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Beatmaker } from "#features/beatmaker/components/Beatmaker";
import { getMetadata } from "#shared/utils/metadata";

export default function BeatmakerPage() {
  return <Beatmaker />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "beatmaker.metadata" });

  return await getMetadata({
    locale,
    pageUrl: "/games/beatmaker",
    title: t("title"),
    description: t("description"),
    imageURL: `/assets/games/beatmaker/og.png`,
  });
}
