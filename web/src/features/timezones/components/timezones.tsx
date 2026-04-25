"use client";

import { Calendar, DateField, DatePicker, Label, TimeField } from "@heroui/react";
import { DateValue, getLocalTimeZone, now } from "@internationalized/date";
import { AnimatePresence } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { City, CityData, CityDataWithExtras, sortedCities } from "#features/timezones/models";
import {
  formatAbsoluteDateInTimeZone,
  getAbsoluteDateForWallClock,
} from "#features/timezones/utils/date-time";
import { Color, colors, LargePill } from "#shared/components/layout/LargePill";
import { Section } from "#shared/components/layout/section";

import { CityAutoComplete } from "./city-auto-complete.tsx";

const getColor = (skip?: Color): Color => {
  const availableColors = colors.filter((color) => color !== skip);
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

export const Timezones = () => {
  const t = useTranslations("timezones");
  const locale = useLocale();

  const [zones, setZones] = useState<CityDataWithExtras[]>([]);
  const [baseZone, setBaseZone] = useState<CityData>();
  const [baseSearchValue, setBaseSearchValue] = useState("");
  const [baseSearchItems, setBaseSearchItems] = useState<City[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchItems, setSearchItems] = useState<City[]>([]);
  const [dateTime, setDateTime] = useState<DateValue | null | undefined>(
    now(getLocalTimeZone()).set({ millisecond: 0, second: 0 }),
  );

  const baseTimeZone = baseZone?.timezone ?? getLocalTimeZone();
  const date = dateTime ? getAbsoluteDateForWallClock(dateTime, baseTimeZone) : new Date();

  const search = (value: string): City[] => {
    if (!value) {
      return [];
    }

    const lcValue = value.toLocaleLowerCase();

    const cities = [];
    for (const city of sortedCities) {
      if (city.lcName.includes(lcValue)) {
        cities.push(city);
        if (cities.length >= 10) {
          break;
        }
      }
    }

    return cities;
  };

  const searchBaseCity = (value: string) => {
    setBaseSearchValue(value);
    setBaseSearchItems(search(value));
  };
  const searchTargetCity = (value: string) => {
    setSearchValue(value);
    setSearchItems(search(value));
  };

  return (
    <>
      <Section>
        <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
          {t("title")}
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-4">
          <CityAutoComplete
            label={t("fromLabel")}
            ariaLabel={t("fromAriaLabel")}
            items={baseSearchItems}
            inputValue={baseSearchValue}
            onInputChange={searchBaseCity}
            testId="city-from"
            onChange={(key) => {
              const keyIndex = typeof key === "string" ? Math.trunc(Number(key)) : -1;
              if (keyIndex >= 0 && keyIndex < sortedCities.length) {
                setBaseZone(sortedCities[keyIndex].data);
              }
            }}
          />

          <DatePicker
            className="chromatic-ignore w-full max-w-100 min-w-64"
            value={dateTime}
            onChange={setDateTime}
            aria-label={t("dateTimeAriaLabel")}
            granularity="minute"
            hideTimeZone
            name="date"
            shouldForceLeadingZeros
          >
            {({ state }) => (
              <>
                <Label>{t("dateTimeLabel")}</Label>
                <DateField.Group fullWidth>
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover className="flex flex-col gap-3">
                  <Calendar aria-label={t("dateAriaLabel")}>
                    <Calendar.Header>
                      <Calendar.YearPickerTrigger>
                        <Calendar.YearPickerTriggerHeading />
                        <Calendar.YearPickerTriggerIndicator />
                      </Calendar.YearPickerTrigger>
                      <Calendar.NavButton slot="previous" />
                      <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(calendarDate) => <Calendar.Cell date={calendarDate} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                      <Calendar.YearPickerGridBody>
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                  <div className="flex items-center justify-between">
                    <Label>{t("timeLabel")}</Label>
                    <TimeField
                      aria-label={t("timeLabel")}
                      granularity="minute"
                      hideTimeZone
                      name="time"
                      shouldForceLeadingZeros
                      value={state.timeValue}
                      onChange={(v) => {
                        if (!v) {
                          return;
                        }
                        state.setTimeValue(v);
                      }}
                    >
                      <TimeField.Group variant="secondary">
                        <TimeField.Input>
                          {(segment) => <TimeField.Segment segment={segment} />}
                        </TimeField.Input>
                      </TimeField.Group>
                    </TimeField>
                  </div>
                </DatePicker.Popover>
              </>
            )}
          </DatePicker>

          {Boolean(baseZone) && (
            <>
              <div className="mt-20 flex flex-col">
                <AnimatePresence initial={false}>
                  {zones.map((zone, i) => (
                    <LargePill
                      key={zone.id}
                      item={zone}
                      onDelete={() => {
                        setZones((z) => z.toSpliced(i, 1));
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <CityAutoComplete
                label={t("toLabel")}
                ariaLabel={t("toAriaLabel")}
                className="mt-20"
                items={searchItems}
                inputValue={searchValue}
                onInputChange={searchTargetCity}
                testId="city-to"
                onChange={(key) => {
                  const keyIndex = typeof key === "string" ? Math.trunc(Number(key)) : -1;
                  if (keyIndex >= 0 && keyIndex < sortedCities.length) {
                    const newZone: CityDataWithExtras = {
                      ...sortedCities[keyIndex].data,
                      color: getColor(zones.at(-1)?.color),
                      content: t.rich("output", {
                        city: sortedCities[keyIndex].data.city,
                        cityWrapper: (chunk) => (
                          <div className="inline font-bold">
                            <span>{chunk}</span>
                          </div>
                        ),
                        time: formatAbsoluteDateInTimeZone(
                          date,
                          locale,
                          sortedCities[keyIndex].data.timezone,
                        ),
                      }),
                      id: crypto.randomUUID(),
                    };
                    setZones([...zones, newZone]);
                    setSearchItems([]);
                    setSearchValue("");
                  }
                }}
              />
            </>
          )}
        </div>
      </Section>
    </>
  );
};
