'use client';

import { NumberInput } from '@heroui/number-input';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { Color, colors, LargePill } from '#components/layout/LargePill.tsx';

import { Section } from '../layout/Section';

type Data = {
  date: Date;
  color: Color;
  content: React.ReactNode;
  id: string;
};

const formatDate = (date: Date) => {
  const year = date.getUTCFullYear().toString();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;
};

const getColor = (skip?: Color): Color => {
  const availableColors = colors.filter(color => color !== skip);
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

export const Timestamp = () => {
  const [timestamps, setTimestamps] = useState<Data[]>([]);
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState(Number.NaN);

  return (
    <>
      <Section>
        <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl uppercase sm:text-8xl xl:text-9xl">
          Timestamp Lookup
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col items-center justify-center gap-4">
          <NumberInput
            hideStepper
            isWheelDisabled
            isClearable
            label="Timestamp"
            size="lg"
            className="chromatic-ignore max-w-[400px]"
            errorMessage={'Invalid timestamp'}
            isInvalid={hasError}
            description={`Automatically detects milliseconds, microseconds, and nanoseconds`}
            value={value}
            // We don't go above 20 digits because what's the point?
            // Also when you reach 21 digits, you start having the ability to
            // input incorrect timestamps
            maxLength={20}
            onValueChange={value => {
              // NaN is used when the input is empty
              if (!Number.isNaN(value)) {
                const len = value.toString().length;
                if (len <= 10) {
                  value = value * 1000; // Convert seconds to milliseconds
                } else if (len > 13) {
                  value = value / Math.pow(10, len - 13); // Convert anything else to milliseconds
                }
                const date = new Date(value);
                const invalid = Number.isNaN(date.getTime());
                setHasError(invalid);
                if (invalid) {
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
                        {Math.floor(date.getTime() / 1000)} is{' '}
                        <span className="font-bold">{formatDate(date)}</span>
                      </>
                    ),
                  },
                ]);
                setValue(Number.NaN);
              }
            }}
          />

          <div className="mt-20 flex flex-col">
            <AnimatePresence initial={false}>
              {timestamps.map((item, i) => (
                <LargePill
                  key={item.id}
                  item={item}
                  onDelete={() => {
                    setTimestamps(timestamps => timestamps.toSpliced(i, 1));
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
