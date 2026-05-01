import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StringLength } from "#features/string-length/components/string-length";
import { getMetadata } from "#shared/utils/metadata";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "stringLength.metadata",
  });

  return await getMetadata({
    description: t("description"),
    locale,
    pageUrl: "/tools/string-length",
    title: t("title"),
  });
};

export default function Home() {
  return <StringLength />;
}
