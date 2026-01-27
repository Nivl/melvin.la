import '../globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import {
  Fira_Code,
  Noto_Sans,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Sans_TC,
} from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Navbar } from '#components/layout/NavBar/Navbar.tsx';
import { Providers } from '#components/Providers';
import { type Locales, locales } from '#i18n/locales';
import { getMetadata } from '#utils/metadata';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
});

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-noto-sans-kr',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-noto-sans-sc',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-noto-sans-tc',
});

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
const fonts = [
  notoSans,
  notoSansKR,
  notoSansSC,
  notoSansTC,
  firaCode,
  baikal,
  burbank,
];

const systemFonts =
  "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

function getFonts(locale: string) {
  let primarySans = 'var(--font-noto-sans)';
  let condensed = 'var(--font-baikal)';
  let fortnite = 'var(--font-burbank)';

  // Baikal (Condensed) and Burbank (Fortnite) are western-only fonts.
  // For other languages, we fallback to the appropriate Noto Sans font
  // to ensure characters are rendered correctly.
  switch (locale) {
    case 'ko':
      primarySans = 'var(--font-noto-sans-kr)';
      condensed = 'var(--font-noto-sans-kr)';
      fortnite = 'var(--font-noto-sans-kr)';
      break;
    case 'zh':
      primarySans = 'var(--font-noto-sans-sc)';
      condensed = 'var(--font-noto-sans-sc)';
      fortnite = 'var(--font-noto-sans-sc)';
      break;
    case 'zh-tw':
      primarySans = 'var(--font-noto-sans-tc)';
      condensed = 'var(--font-noto-sans-tc)';
      fortnite = 'var(--font-noto-sans-tc)';
      break;
  }

  return {
    sans: `${primarySans}, var(--font-noto-sans), var(--font-noto-sans-kr), var(--font-noto-sans-sc), var(--font-noto-sans-tc), ${systemFonts}`,
    condensed,
    fortnite,
  };
}

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
  const { sans, condensed, fortnite } = getFonts(locale);

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`bg-background text-foreground transition-colors duration-300 ${fonts.map(font => font.variable).join(' ')}`}
      style={
        {
          '--font-sans': sans,
          '--font-condensed': condensed,
          '--font-fortnite': fortnite,
        } as React.CSSProperties
      }
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
