'use client';

import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { DateInput } from '@heroui/date-input';
import { DateValue } from '@internationalized/date';
import { getLocalTimeZone, now } from '@internationalized/date';
import { CityData, cityMapping } from 'city-timezones';
import moment from 'moment-timezone';
import { useState } from 'react';
import { MdDeleteForever as DeleteIcon } from 'react-icons/md';

import { Section } from '../layout/Section';

const sortedCities: City[] = Array(cityMapping.length) as City[];

for (let i = 0; i < cityMapping.length; i++) {
  const city = cityMapping[i];
  const lcName = city.city.toLocaleLowerCase();
  sortedCities[i] = { lcName, data: city, entryIndex: i };
}

type City = {
  lcName: string;
  entryIndex: number;
  data: CityData;
};

const colors = [
  'bg-pink-300',
  'bg-green-400',
  'bg-blue-400',
  'bg-amber-400',
  'bg-teal-300',
  'bg-sky-300',
  'bg-indigo-300',
  'bg-violet-300',
  'bg-rose-300',
] as const;

type Color = (typeof colors)[number];

type CityDataWithColor = CityData & {
  color: Color;
};

const getColor = (skip?: Color): Color => {
  const availableColors = colors.filter(color => color !== skip);
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

export const Timezones = () => {
  const [zones, setZones] = useState<CityDataWithColor[]>([]);
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
        <h1 className="font-condensed xl:leading-tight-xl leading-tight-xs sm:leading-tight-sm text-center text-6xl uppercase sm:text-8xl xl:text-9xl">
          Timezone converter
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-4">
          <Autocomplete
            label="When in"
            className="max-w-[400px]"
            size="lg"
            aria-label="Search for a city"
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
            label="it's"
            size="lg"
            className="chromatic-ignore max-w-[400px]"
            hideTimeZone
            value={dateTime}
            onChange={setDateTime}
            granularity="minute"
          />

          {!!baseZone && (
            <>
              {zones.length > 0 && (
                <div className="mt-20 flex flex-col gap-4">
                  {zones.map((zone, i) => (
                    <div key={i} className="group flex justify-center gap-3">
                      {/* empty div so we break out of the flex container to not have a gap around the city name */}
                      <div
                        className={`${zone.color} rounded-full p-7 text-black sm:p-4`}
                      >
                        In{' '}
                        <div className="inline font-bold">
                          <span>{zone.city}</span>
                        </div>{' '}
                        it&apos;s{' '}
                        {date
                          .clone()
                          .tz(zone.timezone)
                          .format('dddd, MMMM Do YYYY, h:mm:ss a')}
                      </div>
                      <a
                        className="cursor-pointer"
                        onClick={() => {
                          setZones(zones => zones.toSpliced(i, 1));
                        }}
                      >
                        <DeleteIcon className="h-full" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
              <Autocomplete
                label="See what day and time it was in"
                className="mt-20 max-w-[400px]"
                size="lg"
                aria-label="Search for a city"
                defaultItems={[]}
                onInputChange={e => {
                  searchTargetCity(e);
                }}
                items={searchItems}
                inputValue={searchValue}
                onSelectionChange={e => {
                  if (typeof e === 'string' && ~~e < sortedCities.length) {
                    const newZone: CityDataWithColor = {
                      ...sortedCities[~~e].data,
                      color: getColor(zones[zones.length - 1]?.color),
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
