import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { use } from "react";

import { Fortnite } from "#features/fortnite/components/Fortnite";
import { isAccountType } from "#features/fortnite/models";
import { getMetadata } from "#shared/utils/metadata";

export default function Home(props: { params: Promise<{ path?: string[]; locale?: string }> }) {
  const { path } = use(props.params);
  const providedType = path?.[1];

  if (providedType && !isAccountType(providedType)) {
    return notFound();
  }

  const accountType = providedType && isAccountType(providedType) ? providedType : undefined;
  return <Fortnite providedName={path?.[0]} providedType={accountType} />;
}

export async function generateMetadata(props: {
  params: Promise<{ path?: string[]; locale: string }>;
}): Promise<Metadata> {
  // read route params
  const { path, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "fortnite.metadata" });

  if (!path || path.length === 0) {
    return {
      ...(await getMetadata({
        locale,
        pageUrl: "/tools/fortnite",
        title: t("title"),
        description: t("description"),
        imageURL: "/assets/tools/fortnite/og.jpg",
      })),
    };
  }

  return {
    ...(await getMetadata({
      locale,
      pageUrl: `/tools/fortnite/${path.join("/")}`,
      title: t("focusTitle", { username: decodeURI(path[0]) }),
      description: t("focusDescription", { username: decodeURI(path[0]) }),
      imageURL: `/assets/tools/fortnite/og.jpg`,
    })),
  };
}
