import { CityData, cityMapping } from "city-timezones";

import { Color } from "#shared/components/layout/LargePill";

export type { CityData };

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
  sortedCities[i] = { data: city, entryIndex: i, lcName };
}
