import { setRequestLocale } from 'next-intl/server';

import { Home } from '#components/Home';

import db from '../db.json';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home sections={db.sections} />;
}
