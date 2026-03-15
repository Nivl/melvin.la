'use client';
import { Button } from '@heroui/button';
import { Slider } from '@heroui/slider';
import { Tooltip } from '@heroui/tooltip';
import { useTranslations } from 'next-intl';
import { FaPlay as PlayIcon, FaStop as StopIcon } from 'react-icons/fa6';
import { LuShare2 } from 'react-icons/lu';

import {
  BPM_MAX,
  BPM_MIN,
  STEP_COUNTS,
  type StepCount,
} from '#models/beatmaker';

type TransportProps = {
  isPlaying: boolean;
  bpm: number;
  stepCount: StepCount;
  copied: boolean;
  onPlayToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onStepCountChange: (steps: StepCount) => void;
  onCopy: () => void;
};

export function Transport({
  isPlaying,
  bpm,
  stepCount,
  copied,
  onPlayToggle,
  onBpmChange,
  onStepCountChange,
  onCopy,
}: TransportProps) {
  const tTransport = useTranslations('beatmaker.transport');
  const tShare = useTranslations('beatmaker.share');

  const separator = <div className="bg-default-200 h-5 w-px" />;

  return (
    <div className="flex w-full items-center justify-between">
      {/* Play / Stop */}
      <Button
        size="sm"
        color={isPlaying ? 'danger' : 'primary'}
        onPress={onPlayToggle}
        startContent={isPlaying ? <StopIcon /> : <PlayIcon />}
      >
        {isPlaying ? tTransport('stop') : tTransport('play')}
      </Button>

      {separator}

      {/* Steps */}
      <div className="flex items-center gap-1.5">
        <span className="text-default-400 text-xs tracking-wider uppercase">
          {tTransport('steps')}
        </span>
        {STEP_COUNTS.map(n => {
          const selected = stepCount === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                onStepCountChange(n);
              }}
              className={[
                'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                'motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-in-out',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-default-400 text-default-400 hover:border-default-600 hover:text-default-600 motion-safe:scale-90',
              ].join(' ')}
            >
              {n}
            </button>
          );
        })}
      </div>

      {separator}

      {/* BPM + Share (right side) */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-default-400 text-xs tracking-widest uppercase">
              {tTransport('bpm')}
            </span>
            <span className="text-foreground font-mono font-bold tabular-nums">
              {bpm}
            </span>
          </div>
          <Slider
            aria-label={tTransport('bpm')}
            minValue={BPM_MIN}
            maxValue={BPM_MAX}
            step={1}
            value={bpm}
            size="sm"
            onChange={v => {
              onBpmChange(v as number);
            }}
            className="w-32"
          />
        </div>

        {separator}

        {/* Share */}
        <Tooltip
          content={tShare('copied')}
          isOpen={copied}
          color="success"
          placement="bottom"
        >
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            aria-label={tShare('copyUrl')}
            onPress={onCopy}
          >
            <LuShare2 />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
