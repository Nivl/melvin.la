'use client';

import {
  CloseButton,
  Form as UiForm,
  Input,
  Label,
  Switch,
  TextField,
} from '@heroui/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';
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

  const t = useTranslations('fortnite.form');
  const nameFieldId = useId();

  useEffect(() => {
    onAccountNameChange(name);
  }, [name, onAccountNameChange]);

  useEffect(() => {
    onAccountTypeChange(accountType);
  }, [accountType, onAccountTypeChange]);

  return (
    <UiForm
      className="flex basis-full flex-col items-center gap-3"
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <div className="relative">
        <TextField
          key={name}
          defaultValue={name}
          className="flex w-auto flex-row items-center gap-5"
        >
          <Label htmlFor={nameFieldId}>{t('accountName')}</Label>
          <Input
            id={nameFieldId}
            placeholder={t('accountName')}
            onChange={e => debounceName(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            data-1p-ignore
            data-lpignore
            data-protonpass-ignore
            data-bwignore
          />
        </TextField>
        {name && (
          <CloseButton
            aria-label={t('clearInput')}
            className="absolute inset-y-2 right-2 flex items-center"
            onPress={() => {
              setName('');
            }}
          />
        )}
      </div>

      <div className="flex flex-row items-center justify-center">
        <label className="text-sm leading-6 font-medium" htmlFor="account-name">
          {t('platform')}
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
            className="hover:text-foreground px-2 transition-colors duration-300"
            aria-label={t('platformEpic')}
          >
            <SiEpicgames
              className={
                accountType === AccountTypes.Epic ? 'text-foreground' : ''
              }
            />
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value={AccountTypes.PSN}
            className="hover:text-brands-playstation px-2 transition-colors duration-300"
            aria-label={t('platformPlaystation')}
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
            className="hover:text-brands-xbox px-2 transition-colors duration-300"
            aria-label={t('platformXbox')}
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
        onChange={(e: boolean) => {
          const v = e ? TimeWindow.Season : TimeWindow.Lifetime;
          setTimeWindow(v);
          onTimeWindowChange(v);
        }}
      >
        <Switch.Content>
          <Label className="text-sm">{t('currentSeasonOnly')}</Label>
        </Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch>
    </UiForm>
  );
};
