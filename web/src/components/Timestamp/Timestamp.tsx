"use client";

import { Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Color, colors, LargePill } from "#components/layout/LargePill.tsx";

import { Section } from "../layout/Section";

type Data = {
  date: Date;
  color: Color;
  content: React.ReactNode;
  id: string;
};

const formatDate = (date: Date) => {
  const year = date.getUTCFullYear().toString();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;
};

const getColor = (skip?: Color): Color => {
  const availableColors = colors.filter((color) => color !== skip);
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

const toDate = (value: string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  // Compute digit length from the original string (before Number() potentially
  // stringifies large values in scientific notation like "1e+21"), stripping a
  // leading minus so negative timestamps are measured correctly.
  const digits = value.startsWith("-") ? value.slice(1) : value;
  const len = digits.length;

  let numValue = Number(value);
  if (Number.isNaN(numValue)) {
    return undefined;
  }
  if (len <= 10) {
    numValue = numValue * 1000; // Convert seconds to milliseconds
  } else if (len > 13) {
    numValue = numValue / Math.pow(10, len - 13); // Convert anything else to milliseconds
  }
  const date = new Date(numValue);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const Timestamp = () => {
  const t = useTranslations("timestamp");

  const [timestamps, setTimestamps] = useState<Data[]>([]);
  const [value, setValue] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const date = toDate(value);
    // Should not happen, but cost nothing to check.
    // setHasError(invalid);
    if (!date) {
      return;
    }
    setTimestamps([
      ...timestamps,
      {
        date,
        id: crypto.randomUUID(),
        color: getColor(timestamps.at(-1)?.color),
        content: (
          <>
            {t.rich("output", {
              timestamp: Math.floor(date.getTime() / 1000),
              utcDate: formatDate(date),
              date: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </>
        ),
      },
    ]);
    setValue("");
  };

  return (
    <>
      <Section>
        <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
          {t("title")}
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col items-center justify-center gap-4">
          <Form className="w-full max-w-[400px]" onSubmit={onSubmit}>
            <TextField
              isRequired
              value={value}
              type="number"
              onChange={(v) => {
                setValue(v);
              }}
              // We don't go above 20 digits because what's the point?
              // Also when you reach 21 digits, you start having the ability to
              // input incorrect timestamps
              validate={(value) => {
                const isValidInput = /^-?[0-9]{1,20}$/i.test(value) && toDate(value) !== undefined;
                return isValidInput ? undefined : t("inputError");
              }}
            >
              <Label>{t("inputLabel")}</Label>
              <Input />
              <Description>{t("inputDescription")}</Description>
              <FieldError />
            </TextField>
            {/* Hidden submit button so Enter key submits the form */}
            <button type="submit" className="sr-only" tabIndex={-1} />
          </Form>

          <div className="mt-20 flex flex-col">
            <AnimatePresence initial={false}>
              {timestamps.map((item, i) => (
                <LargePill
                  key={item.id}
                  item={item}
                  onDelete={() => {
                    setTimestamps((timestamps) => timestamps.toSpliced(i, 1));
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Section>
    </>
  );
};
