"use client";

import {
  Autocomplete,
  Description,
  EmptyState,
  Key,
  Label,
  ListBox,
  SearchField,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import { City } from "#features/timezones/models";

export const CityAutoComplete = ({
  label,
  onChange,
  inputValue,
  onInputChange,
  items,
  ariaLabel,
  className,
  testId,
}: {
  label: string;
  ariaLabel: string;
  inputValue: string;
  className?: string;
  testId?: string;
  onChange: (value: Key | null) => void;
  onInputChange: (value: string) => void;
  items: City[];
}) => {
  const t = useTranslations("timezones");

  return (
    <Autocomplete
      allowsEmptyCollection
      className={twMerge("w-full max-w-100", className)}
      selectionMode="single"
      onChange={onChange}
      aria-label={ariaLabel}
    >
      <Label>{label}</Label>
      <Autocomplete.Trigger data-testid={testId}>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter inputValue={inputValue} onInputChange={onInputChange}>
          <SearchField autoFocus className="sticky top-0 z-10" name="search" variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input data-testid={testId ? `${testId}-search` : undefined} />
            </SearchField.Group>
          </SearchField>
          <ListBox
            className="max-h-[420px] overflow-y-auto"
            items={items}
            renderEmptyState={() => (
              <EmptyState>{inputValue.length > 0 ? t("noResults") : t("startTyping")}</EmptyState>
            )}
          >
            {(item: City) => (
              <ListBox.Item
                key={item.entryIndex.toString()}
                id={item.entryIndex.toString()}
                textValue={`${item.data.city}, ${item.data.country} (${item.data.timezone})`}
                className="capitalize"
              >
                <div className="flex flex-col">
                  <Label>{item.data.city}</Label>
                  <Description>{item.data.country}</Description>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
};
