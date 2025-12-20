import { Metadata } from 'next';

export const getMetadata = ({
  pageUrl,
  title,
  description,
  imageURL,
  extraOg,
}: {
  pageUrl?: string;
  title?: string;
  description?: string;
  imageURL?: string;
  extraOg?: Metadata['openGraph'];
}): Metadata => {
  const images = [{ url: imageURL ?? '/assets/og.jpg' }];
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://melvin.la';
  const url = pageUrl && pageUrl.startsWith('/') ? baseURL + pageUrl : pageUrl;

  return {
    metadataBase: new URL(baseURL),
    title: (title ?? 'Melvin Laplanche') + ' - melvin.la',
    description:
      description ??
      'Personal Website of Melvin Laplanche, nothing really interesting in there',
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
      locale: 'en_US',
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
