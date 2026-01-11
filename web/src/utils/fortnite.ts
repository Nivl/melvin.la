import { useTranslations } from 'next-intl';

// Return of much % of $value is from $total
export const rate = (value: number, total: number) => {
  if (total === 0) {
    return value;
  }
  const rate = total ? (value / total) * 100 : 0;
  return Math.ceil(rate * 100) / 100;
};

export const rateStr = (value: number, total: number) => {
  return `${rate(value, total).toFixed(2)}%`;
};

// convert minutes to human readable duration
export const humanizeDuration = (
  t: ReturnType<typeof useTranslations>,
  minutes: number,
) => {
  let output = '';
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  if (d > 0) {
    output += t('fortnite.daysSpent', { days: d }) + ' ';
  }
  if (h > 0) {
    output += t('fortnite.hoursSpent', { hours: h }) + ' ';
  }
  if (m > 0) {
    output += t('fortnite.minutesSpent', { minutes: m }) + ' ';
  }
  return output;
};
