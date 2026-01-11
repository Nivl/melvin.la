import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { locales } from '#i18n/locales';

export const getMetadata = async ({
  pageUrl,
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
  extraOg?: Metadata['openGraph'];
  locale: string;
}): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace: 'home.metadata' });

  if (pageUrl && !pageUrl.startsWith('/')) {
    pageUrl = '/' + pageUrl;
  }

  const images = [{ url: imageURL ?? '/assets/og.jpg' }];
  const domain = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://melvin.la';
  const baseURL = locale === 'en' ? domain : `${domain}/${locale}`;
  const url = pageUrl ? baseURL + pageUrl : pageUrl;

  // We list all languages for the alternate links, for SEO purposes
  const languages: Record<string, string> = {};
  if (pageUrl) {
    languages['x-default'] = domain + pageUrl;
    for (const loc of locales) {
      languages[loc] =
        loc === 'en' ? domain + pageUrl : `${domain}/${loc}${pageUrl}`;
    }
  }

  return {
    metadataBase: new URL(baseURL),
    title: (title ?? 'Melvin Laplanche') + ' - melvin.la',
    description: description ?? t('description'),
    keywords: [],
    authors: [
      {
        name: 'Melvin Laplanche',
        url: baseURL,
      },
    ],
    robots: 'index, follow',
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url: url ?? baseURL,
      siteName: 'melvin.la',
      images,
      type: 'website',
      locale,
      ...extraOg,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
};
