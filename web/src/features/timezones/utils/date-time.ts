import type { DateValue } from "@internationalized/date";
import { toCalendarDateTime, toZoned } from "@internationalized/date";

const formatterCache = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (locale: string, timeZone: string) => {
  const cacheKey = `${locale}|${timeZone}`;
  const cachedFormatter = formatterCache.get(cacheKey);
  if (cachedFormatter) {
    return cachedFormatter;
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "long",
    timeZone,
    weekday: "long",
    year: "numeric",
  });

  formatterCache.set(cacheKey, formatter);
  return formatter;
};

export const getAbsoluteDateForWallClock = (dateTime: DateValue, baseTimeZone: string) =>
  toZoned(toCalendarDateTime(dateTime), baseTimeZone).toDate();

export const formatAbsoluteDateInTimeZone = (date: Date, locale: string, timeZone: string) =>
  getFormatter(locale, timeZone).format(date);
