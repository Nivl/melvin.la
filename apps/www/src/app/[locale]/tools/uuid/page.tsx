import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Uuid } from "#features/uuid/components/uuid";
import { getMetadata } from "#shared/utils/metadata";

export default function Home() {
  return <Uuid />;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "uuid.metadata",
  });

  return await getMetadata({
    description: t("description"),
    locale,
    pageUrl: "/tools/uuid",
    title: t("title"),
  });
};
