import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { locales } from "#i18n/locales";

export const getMetadata = async ({
  pageUrl = "",
  title,
  description,
  imageURL,
  extraOg,
  locale,
}: {
  pageUrl?: string;
  title?: string;
  description?: string;
  imageURL?: string;
  extraOg?: Metadata["openGraph"];
  locale: string;
}): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace: "home.metadata" });

  if (pageUrl && !pageUrl.startsWith("/")) {
    pageUrl = "/" + pageUrl;
  }

  const images = [{ url: imageURL ?? "/assets/og.jpg" }];
  const domain = process.env.NEXT_PUBLIC_BASE_URL ?? "https://melvin.la";
  const baseURL = locale === "en" ? domain : `${domain}/${locale}`;
  const url = pageUrl ? baseURL + pageUrl : baseURL;

  // We list all languages for the alternate links, for SEO purposes
  const languages: Record<string, string> = {
    "x-default": domain + pageUrl,
  };
  for (const loc of locales) {
    languages[loc] = loc === "en" ? domain + pageUrl : `${domain}/${loc}${pageUrl}`;
  }

  return {
    alternates: {
      canonical: url,
      languages,
    },
    authors: [
      {
        name: "Melvin Laplanche",
        url: domain,
      },
    ],
    description: description ?? t("description"),
    keywords: [],
    metadataBase: new URL(domain),
    openGraph: {
      description,
      images,
      locale,
      siteName: "melvin.la",
      title,
      type: "website",
      url: url,
      ...extraOg,
    },
    robots: "index, follow",
    title: (title ?? "Melvin Laplanche") + " - melvin.la",
    twitter: {
      card: "summary_large_image",
      description,
      images,
      title,
    },
  };
};
