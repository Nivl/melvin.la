import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Conway } from "#features/conway/components/conway";
import { getMetadata } from "#shared/utils/metadata";

export default function Home() {
  return <Conway />;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "conway.metadata" });

  return await getMetadata({
    description: t("description"),
    locale,
    pageUrl: "/games/conway",
    title: t("title"),
  });
};
