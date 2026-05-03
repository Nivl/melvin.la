// Edge case, we need to import the global styles here
// eslint-disable-next-line no-restricted-imports
import "#app/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  Fira_Code,
  Noto_Sans,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Sans_TC,
} from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";

import { isLocale, locales } from "#i18n/locales";
import { Navbar } from "#shared/components/layout/NavBar/navbar";
import { Providers } from "#shared/components/providers";
import { getMetadata } from "#shared/utils/metadata";

type RootStyle = React.CSSProperties &
  Record<"--font-sans" | "--font-condensed" | "--font-fortnite", string>;

const notoSans = Noto_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const notoSansJP = Noto_Sans_JP({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: "variable",
});

const notoSansKR = Noto_Sans_KR({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  weight: "variable",
});

const notoSansSC = Noto_Sans_SC({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  weight: "variable",
});

const notoSansTC = Noto_Sans_TC({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  weight: "variable",
});

const firaCode = Fira_Code({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const baikal = localFont({
  display: "swap",
  src: "../../bundled_static/fonts/baikal_trial_ultra_condensed.woff2",
  variable: "--font-baikal",
});

const burbank = localFont({
  display: "swap",
  src: "../../bundled_static/fonts/burbank_big_condensed_bold.woff2",
  variable: "--font-burbank",
});

// Core fonts are used by every locale. CJK fonts attach only for their
// matching locale so the browser doesn't see unused @font-face rules.
const coreFonts = [notoSans, firaCode, baikal, burbank];

const localeFontMap = {
  ja: notoSansJP,
  ko: notoSansKR,
  zh: notoSansSC,
  "zh-tw": notoSansTC,
} as const;

const localePrimarySans = {
  ja: "var(--font-noto-sans-jp)",
  ko: "var(--font-noto-sans-kr)",
  zh: "var(--font-noto-sans-sc)",
  "zh-tw": "var(--font-noto-sans-tc)",
} as const;

const systemFonts =
  "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

const isCJKLocale = (locale: string): locale is keyof typeof localeFontMap =>
  locale in localeFontMap;

const getFontsForLocale = (locale: string) => {
  if (!isCJKLocale(locale)) {
    return {
      condensed: "var(--font-baikal)",
      fonts: coreFonts,
      fortnite: "var(--font-burbank)",
      sans: `var(--font-noto-sans), ${systemFonts}`,
    };
  }

  const extra = localeFontMap[locale];
  const primarySans = localePrimarySans[locale];

  return {
    condensed: primarySans,
    fonts: [...coreFonts, extra],
    fortnite: primarySans,
    sans: `${primarySans}, ${systemFonts}`,
  };
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return await getMetadata({ locale });
};

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!isLocale(locale)) {
    return notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const msg = await getMessages();
  const { condensed, fonts, fortnite, sans } = getFontsForLocale(locale);
  const style: RootStyle = {
    "--font-condensed": condensed,
    "--font-fortnite": fortnite,
    "--font-sans": sans,
  };

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`bg-background text-foreground transition-colors duration-300 ${fonts.map((font) => font.variable).join(" ")}`}
      style={style}
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
