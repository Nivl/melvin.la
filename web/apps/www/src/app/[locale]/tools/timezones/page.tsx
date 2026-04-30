import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Timezones } from "#features/timezones/components/timezones";
import { getMetadata } from "#shared/utils/metadata";

export default function Home() {
  return <Timezones />;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "timezones.metadata",
  });

  return await getMetadata({
    description: t("description"),
    locale,
    pageUrl: "/tools/timezones",
    title: t("title"),
  });
};
