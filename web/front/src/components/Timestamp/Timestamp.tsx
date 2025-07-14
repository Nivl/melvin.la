'use client';

import { NumberInput } from '@heroui/number-input';
import { useState } from 'react';
import { MdDeleteForever as DeleteIcon } from 'react-icons/md';

import { Section } from '../layout/Section';

export const Timestamp = () => {
  const [timestamps, setTimestamps] = useState<Date[]>([]);
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState(NaN);

  return (
    <>
      <Section>
        <h1 className="font-condensed xl:leading-tight-xl leading-tight-xs sm:leading-tight-sm text-center text-6xl uppercase sm:text-8xl xl:text-9xl">
          Timestamp Lookup
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <NumberInput
              hideStepper
              isWheelDisabled
              isClearable
              label="Timestamp"
              className="chromatic-ignore max-w-[284px]"
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
                if (!isNaN(value)) {
                  const len = value.toString().length;
                  if (len <= 10) {
                    value = value * 1000; // Convert seconds to milliseconds
                  } else if (len > 13) {
                    value = value / Math.pow(10, len - 13); // Convert anything else to milliseconds
                  }
                  const date = new Date(value);
                  const invalid = isNaN(date.getTime());
                  setHasError(invalid);
                  if (invalid) {
                    return;
                  }
                  setTimestamps([date, ...timestamps]);
                  setValue(NaN);
                }
              }}
            />
          </div>

          {timestamps.length > 0 && (
            <div className="mt-20 flex flex-col content-center gap-4 text-center">
              {timestamps.map((timestamp, i) => (
                <div key={i} className="flex justify-center gap-3">
                  {/* used to break out of the flex container to not have a gap around bold text */}
                  <div>
                    {Math.floor(timestamp.getTime() / 1000)} is{' '}
                    <span className="font-bold">
                      {timestamp.getUTCFullYear().toString()}/
                      {(timestamp.getUTCMonth() + 1)
                        .toString()
                        .padStart(2, '0')}
                      /{timestamp.getUTCDate().toString().padStart(2, '0')}{' '}
                      {timestamp.getUTCHours().toString().padStart(2, '0')}:
                      {timestamp.getUTCMinutes().toString().padStart(2, '0')}:
                      {timestamp.getUTCSeconds().toString().padStart(2, '0')}{' '}
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
