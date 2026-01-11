'use client';

import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { DateInput } from '@heroui/date-input';
import { DateValue, getLocalTimeZone, now } from '@internationalized/date';
import { CityData, cityMapping } from 'city-timezones';
import moment from 'moment-timezone';
import { AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Color, colors, LargePill } from '#components/layout/LargePill.tsx';

import { Section } from '../layout/Section';

const sortedCities: City[] = Array.from({
  length: cityMapping.length,
});

for (const [i, city] of cityMapping.entries()) {
  const lcName = city.city.toLocaleLowerCase();
  sortedCities[i] = { lcName, data: city, entryIndex: i };
}

type City = {
  lcName: string;
  entryIndex: number;
  data: CityData;
};

type CityDataWithExtras = CityData & {
  color: Color;
  id: string;
  content: React.ReactNode;
};

const getColor = (skip?: Color): Color => {
  const availableColors = colors.filter(color => color !== skip);
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

export const Timezones = () => {
  const t = useTranslations('timezones');

  const [zones, setZones] = useState<CityDataWithExtras[]>([]);
  const [baseZone, setBaseZone] = useState<CityData>();
  const [baseSearchValue, setBaseSearchValue] = useState<string>('');
  const [baseSearchItems, setBaseSearchItems] = useState<City[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchItems, setSearchItems] = useState<City[]>([]);
  const [dateTime, setDateTime] = useState<DateValue | null | undefined>(
    now(getLocalTimeZone()).set({ second: 0, millisecond: 0 }),
  );

  const date = dateTime
    ? moment.tz(
        // using the proper `dateTime.toDate('utc')` creates issues
        // on some days where daylight saving time kicks off.
        // For example, Saturday March 25th 1989 at 5pm in Paris
        // Shows as 4pm in... Paris. It's off by one hour in every
        // other timezones as well.
        dateTime.toString().slice(0, 19),
        baseZone?.timezone ?? getLocalTimeZone(),
      )
    : moment();

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
        <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl uppercase sm:text-8xl xl:text-9xl">
          {t('title')}
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-4">
          <Autocomplete
            label={t('fromLabel')}
            className="max-w-[400px]"
            size="lg"
            aria-label={t('fromAriaLabel')}
            defaultItems={[]}
            onInputChange={e => {
              searchBaseCity(e);
            }}
            items={baseSearchItems}
            inputValue={baseSearchValue}
            onSelectionChange={e => {
              if (typeof e === 'string' && ~~e < sortedCities.length) {
                setBaseZone(sortedCities[~~e].data);
              }
            }}
            allowsEmptyCollection={false}
            allowsCustomValue
            multiple={false}
            menuTrigger="input"
          >
            {item => (
              <AutocompleteItem
                key={item.entryIndex.toString()}
                className="capitalize"
                textValue={`${item.data.city}, ${item.data.country} (${item.data.timezone})`}
              >
                {item.data.city}, {item.data.country} ({item.data.timezone})
              </AutocompleteItem>
            )}
          </Autocomplete>
          <DateInput
            label={t('dateTimeLabel')}
            aria-label={t('dateTimeAriaLabel')}
            size="lg"
            className="chromatic-ignore max-w-[400px]"
            hideTimeZone
            value={dateTime}
            onChange={setDateTime}
            granularity="minute"
          />

          {!!baseZone && (
            <>
              <div className="mt-20 flex flex-col">
                <AnimatePresence initial={false}>
                  {zones.map((zone, i) => (
                    <LargePill
                      key={zone.id}
                      item={zone}
                      onDelete={() => {
                        setZones(zones => zones.toSpliced(i, 1));
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <Autocomplete
                label={t('toLabel')}
                className="mt-20 max-w-[400px]"
                size="lg"
                aria-label={t('toAriaLabel')}
                defaultItems={[]}
                onInputChange={e => {
                  searchTargetCity(e);
                }}
                items={searchItems}
                inputValue={searchValue}
                onSelectionChange={e => {
                  if (typeof e === 'string' && ~~e < sortedCities.length) {
                    const newZone: CityDataWithExtras = {
                      ...sortedCities[~~e].data,
                      id: crypto.randomUUID(),
                      color: getColor(zones.at(-1)?.color),
                      content: t.rich('output', {
                        city: sortedCities[~~e].data.city,
                        time: date
                          .clone()
                          .tz(sortedCities[~~e].data.timezone)
                          .format('LLLL'),
                        cityWrapper: chunk => (
                          <div className="inline font-bold">
                            <span>{chunk}</span>
                          </div>
                        ),
                      }),
                    };
                    setZones([...zones, newZone]);
                    setSearchItems([]);
                    setSearchValue('');
                  }
                }}
                allowsEmptyCollection={false}
                allowsCustomValue
                multiple={false}
                menuTrigger="input"
              >
                {item => (
                  <AutocompleteItem
                    key={item.entryIndex.toString()}
                    className="capitalize"
                    textValue={`${item.data.city}, ${item.data.country} (${item.data.timezone})`}
                  >
                    {item.data.city}, {item.data.country} ({item.data.timezone})
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </>
          )}
        </div>
      </Section>
    </>
  );
};
