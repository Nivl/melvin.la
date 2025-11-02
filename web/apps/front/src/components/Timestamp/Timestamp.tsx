'use client';

import { NumberInput } from '@heroui/number-input';
import { useState } from 'react';
import { MdDeleteForever as DeleteIcon } from 'react-icons/md';

import { Section } from '../layout/Section';

const colors = [
  'bg-pink-300',
  'bg-green-400',
  'bg-blue-400',
  'bg-amber-400',
  'bg-teal-300',
  'bg-sky-300',
  'bg-indigo-300',
  'bg-violet-300',
  'bg-rose-300',
] as const;

type Color = (typeof colors)[number];

type Data = {
  date: Date;
  color: Color;
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
                    color: getColor(timestamps.at(-1)?.color),
                  },
                ]);
                setValue(Number.NaN);
              }
            }}
          />

          {timestamps.length > 0 && (
            <div className="mt-20 flex flex-col gap-4">
              {timestamps.map((timestamp, i) => (
                <div
                  key={i}
                  className={`${timestamp.color} flex justify-center gap-3 rounded-full p-7 text-black sm:p-4`}
                >
                  {/* used to break out of the flex container to not have a gap around bold text */}
                  <div>
                    {Math.floor(timestamp.date.getTime() / 1000)} is{' '}
                    <span className="font-bold">
                      {timestamp.date.getUTCFullYear().toString()}/
                      {(timestamp.date.getUTCMonth() + 1)
                        .toString()
                        .padStart(2, '0')}
                      /{timestamp.date.getUTCDate().toString().padStart(2, '0')}{' '}
                      {timestamp.date.getUTCHours().toString().padStart(2, '0')}
                      :
                      {timestamp.date
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, '0')}
                      :
                      {timestamp.date
                        .getUTCSeconds()
                        .toString()
                        .padStart(2, '0')}{' '}
                      UTC
                    </span>
                  </div>
                  <a
                    className="cursor-pointer"
                    onClick={() => {
                      setTimestamps(timestamps => timestamps.toSpliced(i, 1));
                    }}
                  >
                    <DeleteIcon className="h-full" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
};
