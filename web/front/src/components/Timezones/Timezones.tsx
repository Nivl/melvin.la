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

export const Timezones = () => {
  const [zones, setZones] = useState<CityData[]>([]);
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
        <h1 className="mb-5 pb-5 text-center text-3xl font-black uppercase">
          Timezone convertor
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <div className="w-20 text-center">When in</div>
            <Autocomplete
              label="Search for a city"
              className="max-w-[284px]"
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
          </div>
          <div className="flex flex-row items-center justify-center gap-4">
            <div className="w-20 text-center">it&apos;s</div>
            <DateInput
              label="Time to convert"
              className="chromatic-ignore max-w-[284px]"
              hideTimeZone
              value={dateTime}
              onChange={setDateTime}
              granularity="minute"
            />
          </div>

          {!!baseZone && (
            <>
              {zones.length > 0 && (
                <div className="mt-20 flex flex-col content-center gap-4 text-center">
                  {zones.map((zone, i) => (
                    <div key={i} className="flex justify-center gap-3">
                      {/* used to break out of the flex container to not have a gap around the city name */}
                      <div>
                        In <span className="font-bold">{zone.city}</span>{' '}
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

              <div className="mt-20 flex flex-row items-center justify-center gap-4">
                See what day and time it was in
                <Autocomplete
                  label="Search for a city"
                  className="max-w-[284px]"
                  aria-label="Search for a city"
                  defaultItems={[]}
                  onInputChange={e => {
                    searchTargetCity(e);
                  }}
                  items={searchItems}
                  inputValue={searchValue}
                  onSelectionChange={e => {
                    if (typeof e === 'string' && ~~e < sortedCities.length) {
                      setZones([...zones, sortedCities[~~e].data]);
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
                      {item.data.city}, {item.data.country} (
                      {item.data.timezone})
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
};
