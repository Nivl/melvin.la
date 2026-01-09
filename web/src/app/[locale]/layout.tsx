import '../globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Fira_Code, Raleway } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Navbar } from '#components/layout/NavBar/Navbar.tsx';
import { Providers } from '#components/Providers';
import { type Locales, locales } from '#i18n/locales';
import { getMetadata } from '#utils/metadata';

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

const baikal = localFont({
  src: '../../bundled_static/fonts/baikal_trial_ultra_condensed.woff2',
  variable: '--font-baikal',
});

const burbank = localFont({
  src: '../../bundled_static/fonts/burbank_big_condensed_bold.woff2',
  variable: '--font-burbank',
});

// Adding a new font?
//
// You'll need to add your fonts to:
// - Tailwind's tailwind.config.ts file
// - Storybook's fonts.css file
const fonts = [raleway, firaCode, baikal, burbank];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await getMetadata({ locale });
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as Locales)) {
    return notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const msg = await getMessages();

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`bg-background text-foreground transition-colors duration-300 ${fonts.map(font => font.variable).join(' ')}`}
    >
      <body className="h-full font-sans text-base leading-relaxed font-light lining-nums antialiased transition-colors xl:text-xl xl:leading-relaxed">
        <Providers locale={locale} messages={msg}>
          <Navbar />
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
