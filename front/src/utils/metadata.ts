import type { Metadata } from 'next';

const getMetadata = ({
  url,
  title,
  description,
  imageURL,
}: {
  url: string;
  title: string;
  description: string;
  imageURL: string;
}): Metadata => ({
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://melvin.la',
  ),
  title: url ?? 'Melvin Laplanche',
  description:
    'Personal Website of Melvin Laplanche, nothing really interesting in there',
});
