'use client';

import { Input } from '@heroui/input';
import { Switch } from '@heroui/switch';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState } from 'react';
import { FaPlaystation, FaXbox } from 'react-icons/fa';
import { SiEpicgames } from 'react-icons/si';
import { useDebouncedCallback } from 'use-debounce';

export enum AccountTypes {
  Epic = 'epic',
  PSN = 'psn',
  Xbox = 'xbl',
}

export enum TimeWindow {
  Season = 'season',
  Lifetime = 'lifetime',
}

export const Form = ({
  onAccountNameChange,
  onAccountTypeChange,
  onTimeWindowChange,
  defaultTimeWindow,
  defaultAccountType,
  defaultAccountName = '',
}: {
  onAccountNameChange: (name: string) => void;
  onAccountTypeChange: (type: AccountTypes) => void;
  onTimeWindowChange: (window: TimeWindow) => void;
  defaultAccountName?: string;
  defaultAccountType: AccountTypes;
  defaultTimeWindow: TimeWindow;
}) => {
  const [name, setName] = useState(defaultAccountName);
  const debounceName = useDebouncedCallback((name: string) => {
    setName(name);
  }, 1000);

  const [accountType, setAccountType] = useState(defaultAccountType);
  const [timeWindow, setTimeWindow] = useState(defaultTimeWindow);

  useEffect(() => {
    onAccountNameChange(name);
  }, [name, onAccountNameChange]);

  useEffect(() => {
    onAccountTypeChange(accountType);
  }, [accountType, onAccountTypeChange]);

  return (
    <form
      className="flex basis-full flex-col items-center gap-3"
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <Input
        key={name}
        className="w-auto"
        type="text"
        label="Account Name"
        labelPlacement="outside-left"
        placeholder="Account Name"
        variant="bordered"
        defaultValue={name}
        onChange={e => debounceName(e.target.value)}
        onClear={() => {
          setName('');
        }}
        isClearable
      />

      <div className="flex flex-row items-center justify-center">
        <label className="text-sm leading-6 font-medium" htmlFor="account-name">
          Platform
        </label>

        <ToggleGroup.Root
          type="single"
          className="px-4 py-3 text-3xl text-gray-300 dark:text-neutral-600" //3e3e45
          value={accountType}
          onValueChange={v => {
            if (v !== '') {
              setAccountType(v as AccountTypes);
            }
          }}
        >
          <ToggleGroup.Item
            value={AccountTypes.Epic}
            className="hover:text-brands-epic px-2 transition-colors"
            aria-label="Epic Games"
          >
            <SiEpicgames
              className={
                accountType === AccountTypes.Epic ? 'text-foreground' : ''
              }
            />
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value={AccountTypes.PSN}
            className="hover:text-brands-playstation px-2 transition-colors"
            aria-label="PlayStation"
          >
            <FaPlaystation
              className={
                accountType === AccountTypes.PSN
                  ? 'text-brands-playstation'
                  : ''
              }
            />
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value={AccountTypes.Xbox}
            className="hover:text-brands-xbox px-2 transition-colors"
            aria-label="Xbox"
          >
            <FaXbox
              className={
                accountType === AccountTypes.Xbox ? 'text-brands-xbox' : ''
              }
            />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <Switch
        isSelected={timeWindow === TimeWindow.Season}
        color="secondary"
        onValueChange={(e: boolean) => {
          const v = e ? TimeWindow.Season : TimeWindow.Lifetime;
          setTimeWindow(v);
          onTimeWindowChange(v);
        }}
        classNames={{
          base: 'flex-row-reverse',
        }}
      >
        <span className="text-foreground pr-2 text-sm">
          Current season only
        </span>
      </Switch>
    </form>
  );
};
