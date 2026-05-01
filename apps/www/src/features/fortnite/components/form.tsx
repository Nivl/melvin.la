"use client";

import { CloseButton, Form as UiForm, Input, Label, Switch, TextField } from "@heroui/react";
import { Item as ToggleGroupItem, Root as ToggleGroupRoot } from "@radix-ui/react-toggle-group";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import { useDebouncedCallback } from "use-debounce";

import {
  AccountTypes,
  isAccountType,
  TimeWindow,
  userNameMaxLength,
} from "#features/fortnite/models";

export const Form = ({
  onAccountNameChange,
  onAccountTypeChange,
  onTimeWindowChange,
  defaultTimeWindow,
  defaultAccountType,
  defaultAccountName = "",
}: {
  onAccountNameChange: (name: string) => void;
  onAccountTypeChange: (type: AccountTypes) => void;
  onTimeWindowChange: (window: TimeWindow) => void;
  defaultAccountName?: string;
  defaultAccountType: AccountTypes;
  defaultTimeWindow: TimeWindow;
}) => {
  // `inputValue` is the live, controlled value of the text field — updated on
  // every keystroke so the input never loses its value across re-renders.
  // `debouncedOnAccountNameChange` throttles the parent notification to 1000ms
  // so the search/URL update only fires after the user stops typing, while
  // keeping the input itself responsive at all times.
  const [inputValue, setInputValue] = useState(defaultAccountName);
  const debouncedOnAccountNameChange = useDebouncedCallback((name: string) => {
    onAccountNameChange(name);
  }, 1000);

  const [accountType, setAccountType] = useState(defaultAccountType);
  const [timeWindow, setTimeWindow] = useState(defaultTimeWindow);

  const t = useTranslations("fortnite.form");
  const nameFieldId = useId();

  useEffect(() => {
    if (defaultAccountName) {
      onAccountNameChange(defaultAccountName);
    }
    // Intentionally runs once on mount to notify parent of the initial/preset value.
    // The Form is remounted via `key` when the preset changes, so this fires on each preset selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onAccountTypeChange(accountType);
  }, [accountType, onAccountTypeChange]);

  return (
    <UiForm
      className="flex basis-full flex-col items-center gap-3"
      onSubmit={(evt) => {
        evt.preventDefault();
      }}
    >
      <div className="relative">
        {/* value/onChange live on TextField (not Input) so React Aria's internal
            focus management stays in control. Putting `value` directly on Input
            bypasses the compound component's context and causes focus to be lost
            whenever the parent re-renders (e.g. after the debounce fires). */}
        <TextField
          className="flex w-auto flex-row items-center gap-5"
          value={inputValue}
          onChange={(val) => {
            setInputValue(val);
            debouncedOnAccountNameChange(val);
          }}
        >
          <Label htmlFor={nameFieldId}>{t("accountName")}</Label>
          <Input
            id={nameFieldId}
            placeholder={t("accountName")}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            maxLength={userNameMaxLength}
            data-1p-ignore
            data-op-ignore
            data-lpignore
            data-protonpass-ignore
            data-bwignore
          />
        </TextField>
        {inputValue && (
          <CloseButton
            aria-label={t("clearInput")}
            className="absolute inset-y-1.5 right-2 flex items-center"
            onPress={() => {
              setInputValue("");
              debouncedOnAccountNameChange.cancel();
              onAccountNameChange("");
            }}
          />
        )}
      </div>

      <div className="flex flex-row items-center justify-center">
        <label className="text-sm leading-6 font-medium" htmlFor="account-name">
          {t("platform")}
        </label>

        <ToggleGroupRoot
          type="single"
          className="px-4 py-3 text-3xl text-gray-300 dark:text-neutral-600" //3e3e45
          value={accountType}
          onValueChange={(v) => {
            if (isAccountType(v)) {
              setAccountType(v);
            }
          }}
        >
          <ToggleGroupItem
            value={AccountTypes.Epic}
            className="px-2 transition-colors duration-300 hover:text-foreground"
            aria-label={t("platformEpic")}
          >
            <SiEpicgames className={accountType === AccountTypes.Epic ? "text-foreground" : ""} />
          </ToggleGroupItem>
          <ToggleGroupItem
            value={AccountTypes.PSN}
            className="px-2 transition-colors duration-300 hover:text-brands-playstation"
            aria-label={t("platformPlaystation")}
          >
            <FaPlaystation
              className={accountType === AccountTypes.PSN ? "text-brands-playstation" : ""}
            />
          </ToggleGroupItem>
          <ToggleGroupItem
            value={AccountTypes.Xbox}
            className="px-2 transition-colors duration-300 hover:text-brands-xbox"
            aria-label={t("platformXbox")}
          >
            <FaXbox className={accountType === AccountTypes.Xbox ? "text-brands-xbox" : ""} />
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </div>

      <Switch
        isSelected={timeWindow === TimeWindow.Season}
        onChange={(isSelected: boolean) => {
          const v = isSelected ? TimeWindow.Season : TimeWindow.Lifetime;
          setTimeWindow(v);
          onTimeWindowChange(v);
        }}
      >
        <Switch.Content>
          <Label className="text-sm">{t("currentSeasonOnly")}</Label>
        </Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch>
    </UiForm>
  );
};
