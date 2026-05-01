import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Pathfinding } from "#features/pathfinding/components/pathfinding";
import { getMetadata } from "#shared/utils/metadata";

export default function PathfindingPage() {
  return <Pathfinding />;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pathfinding.metadata",
  });

  return await getMetadata({
    description: t("description"),
    locale,
    pageUrl: "/tools/pathfinding",
    title: t("title"),
  });
};
