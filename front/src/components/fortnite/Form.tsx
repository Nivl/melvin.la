'use client';

import { Input, Switch } from '@nextui-org/react';
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
  const debounceName = useDebouncedCallback(name => setName(name), 1000);
  // When it's value change, we redraw the form and update the default
  // value of the name input. We have to do this to display the presets
  // as well as the local storage value in the input.
  // This is because we cannot use 'name' as it is debounced, and
  // debounceName doesn't contains the current value being debounced.
  const [nameKey, setNameKey] = useState('');

  const [accountType, setAccountType] = useState(AccountTypes.Epic);
  const [timeWindow, setTimeWindow] = useState(defaultTimeWindow);

  // Set the data from the local storage if there is some.
  // That's so the user can come back to the page and see their
  // data directly without having to re-enter anything.
  useEffect(() => {
    const accountName = localStorage.getItem('accountName');
    if (accountName) {
      setName(accountName);
      setNameKey(accountName);
    }

    const accountType = localStorage.getItem(
      'accountType',
    ) as AccountTypes | null;

    if (
      accountType &&
      Object.values(AccountTypes).includes(accountType) &&
      // we ignore the default value to avoid a race with useDebounce
      // always triggering with the default value and overriding the
      // local storage temporarily.
      accountType !== AccountTypes.Epic
    ) {
      setAccountType(accountType);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accountName', name);
    onAccountNameChange(name);
  }, [name, onAccountNameChange]);

  useEffect(() => {
    localStorage.setItem('accountType', accountType);
    onAccountTypeChange(accountType);
  }, [accountType, onAccountTypeChange]);

  // Used when the user picks a preset
  useEffect(() => {
    if (defaultAccountName) {
      setName(defaultAccountName);
      setNameKey(defaultAccountName);
      setAccountType(defaultAccountType);
      setTimeWindow(defaultTimeWindow);
    }
  }, [defaultAccountName, defaultAccountType, defaultTimeWindow]);

  return (
    <form
      className="flex basis-full flex-col items-center gap-3"
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <Input
        key={nameKey}
        className="w-auto"
        type="text"
        label="Account Name"
        labelPlacement="outside-left"
        placeholder="Account Name"
        variant="bordered"
        defaultValue={name}
        onChange={e => debounceName(e.target.value)}
      />

      <div className="flex flex-row items-center justify-center">
        <label className="text-sm font-medium leading-6" htmlFor="account-name">
          Platform
        </label>

        <ToggleGroup.Root
          type="single"
          className="px-4 py-3 text-3xl text-gray-500"
          value={accountType}
          onValueChange={v => {
            if (v !== '') {
              setAccountType(v as AccountTypes);
            }
          }}
        >
          <ToggleGroup.Item
            value={AccountTypes.Epic}
            className="px-2 transition-colors hover:text-brands-epic"
            aria-label="Epic Games"
          >
            <SiEpicgames
              className={
                accountType === AccountTypes.Epic ? 'text-brands-epic' : ''
              }
            />
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value={AccountTypes.PSN}
            className="px-2 transition-colors hover:text-brands-playstation"
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
            className="px-2 transition-colors hover:text-brands-xbox"
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
        <span className="pr-2 text-sm text-foreground">
          Current season only
        </span>
      </Switch>
    </form>
  );
};
