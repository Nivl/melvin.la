import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Timestamp } from "#features/timestamp/components/timestamp";
import { getMetadata } from "#shared/utils/metadata";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "timestamp.metadata",
  });

  return await getMetadata({
    description: t("description"),
    locale,
    pageUrl: "/tools/timestamp",
    title: t("title"),
  });
};

export default function Home() {
  return <Timestamp />;
}
