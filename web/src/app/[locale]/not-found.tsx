import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { getMetadata } from "#shared/utils/metadata";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "errorPages.404.metadata",
  });

  return await getMetadata({
    description: t("description"),
    locale,
    title: t("title"),
  });
};

export default function NotFound() {
  const t = useTranslations("errorPages.404");
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="flex">
        <span className="mr-6 border-r border-gray-200 pr-6">404</span>
        <span>{t("title")}</span>
      </h1>
    </div>
  );
}
