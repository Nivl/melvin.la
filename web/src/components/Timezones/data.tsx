import { CityData, cityMapping } from 'city-timezones';

import { Color } from '#components/layout/LargePill.tsx';

export { type CityData } from 'city-timezones';

export type City = {
  lcName: string;
  entryIndex: number;
  data: CityData;
};

export type CityDataWithExtras = CityData & {
  color: Color;
  id: string;
  content: React.ReactNode;
};

export const sortedCities: City[] = Array.from({
  length: cityMapping.length,
});

for (const [i, city] of cityMapping.entries()) {
  const lcName = city.city.toLocaleLowerCase();
  sortedCities[i] = { lcName, data: city, entryIndex: i };
}
