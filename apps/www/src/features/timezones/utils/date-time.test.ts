import { CalendarDateTime, parseZonedDateTime } from "@internationalized/date";
import { describe, expect, it } from "vitest";

import { formatAbsoluteDateInTimeZone, getAbsoluteDateForWallClock } from "./date-time";

type ConversionCase = {
  name: string;
  baseTimeZone: string;
  dateTime: CalendarDateTime;
  expectedIso: string;
};

const conversionCases: ConversionCase[] = [
  {
    baseTimeZone: "America/New_York",
    dateTime: new CalendarDateTime(2024, 3, 10, 1, 30, 0),
    expectedIso: "2024-03-10T06:30:00.000Z",
    name: "US DST spring-forward",
  },
  {
    baseTimeZone: "America/New_York",
    dateTime: new CalendarDateTime(2024, 11, 3, 2, 30, 0),
    expectedIso: "2024-11-03T07:30:00.000Z",
    name: "US DST fall-back",
  },
  {
    baseTimeZone: "Europe/Paris",
    dateTime: new CalendarDateTime(1989, 3, 25, 17, 0, 0),
    expectedIso: "1989-03-25T16:00:00.000Z",
    name: "Paris 1989 DST regression",
  },
  {
    baseTimeZone: "Australia/Sydney",
    dateTime: new CalendarDateTime(2024, 10, 6, 1, 30, 0),
    expectedIso: "2024-10-05T15:30:00.000Z",
    name: "Australia DST spring-forward",
  },
  {
    baseTimeZone: "Asia/Kolkata",
    dateTime: new CalendarDateTime(2024, 1, 15, 9, 0, 0),
    expectedIso: "2024-01-15T03:30:00.000Z",
    name: "India no-DST control",
  },
  {
    baseTimeZone: "Asia/Kathmandu",
    dateTime: new CalendarDateTime(2024, 1, 15, 9, 0, 0),
    expectedIso: "2024-01-15T03:15:00.000Z",
    name: "Nepal 45-minute offset",
  },
  {
    baseTimeZone: "Pacific/Apia",
    dateTime: new CalendarDateTime(2011, 12, 31, 12, 0, 0),
    expectedIso: "2011-12-30T22:00:00.000Z",
    name: "Samoa post-date-line jump",
  },
];

describe(getAbsoluteDateForWallClock, () => {
  it.each(conversionCases)(
    "$name",
    ({ baseTimeZone, dateTime, expectedIso }) => {
      expect.assertions(1);
      expect(getAbsoluteDateForWallClock(dateTime, baseTimeZone).toISOString()).toBe(expectedIso);
    },
    5000,
  );

  it("reinterprets ZonedDateTime wall-clock values in the selected base timezone", () => {
    expect.assertions(3);
    const dateTime = parseZonedDateTime("1989-03-25T18:30:00-10:00[Pacific/Honolulu]");
    const absoluteDate = getAbsoluteDateForWallClock(dateTime, "Europe/Paris");

    expect(absoluteDate.toISOString()).toBe("1989-03-25T17:30:00.000Z");
    expect(formatAbsoluteDateInTimeZone(absoluteDate, "en", "Europe/Paris")).toBe(
      "Saturday, March 25, 1989 at 6:30 PM",
    );
    expect(formatAbsoluteDateInTimeZone(absoluteDate, "en", "Asia/Taipei")).toBe(
      "Sunday, March 26, 1989 at 1:30 AM",
    );
  }, 5000);
});

describe(formatAbsoluteDateInTimeZone, () => {
  it("formats the Paris 1989 regression case in the target timezone", () => {
    expect.assertions(1);
    const date = getAbsoluteDateForWallClock(
      new CalendarDateTime(1989, 3, 25, 17, 0, 0),
      "Europe/Paris",
    );

    expect(formatAbsoluteDateInTimeZone(date, "en", "Australia/Sydney")).toBe(
      "Sunday, March 26, 1989 at 2:00 AM",
    );
  }, 5000);
});
