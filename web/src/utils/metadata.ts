import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

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

  const images = [{ url: imageURL ?? '/assets/og.jpg' }];
  const domain = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://melvin.la';
  const baseURL = locale === 'en' ? domain : `${domain}/${locale}`;
  const url = pageUrl && pageUrl.startsWith('/') ? baseURL + pageUrl : pageUrl;

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
