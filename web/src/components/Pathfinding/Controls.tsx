'use client';

import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Slider } from '@heroui/slider';
import { useTranslations } from 'next-intl';
import { FaPlay as PlayIcon, FaStop as StopIcon } from 'react-icons/fa6';
import { GiMaze as MazeIcon } from 'react-icons/gi';
import { MdClear as ClearIcon } from 'react-icons/md';

import type { Algorithm } from '#utils/pathfinding/types';

export const SPEED_VALUES = {
  slow: 80,
  medium: 30,
  fast: 5,
} as const;

type ControlsProps = {
  algorithm: Algorithm;
  onAlgorithmChange: (algo: Algorithm) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  rows: number;
  cols: number;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  isAnimating: boolean;
  onVisualize: () => void;
  onStop: () => void;
  onReset: () => void;
  onClearAll: () => void;
  onGenerateMaze: () => void;
};

export const Controls = ({
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  rows,
  cols,
  onRowsChange,
  onColsChange,
  isAnimating,
  onVisualize,
  onStop,
  onReset,
  onClearAll,
  onGenerateMaze,
}: ControlsProps) => {
  const t = useTranslations('pathfinding');

  const algorithmOptions: { key: Algorithm; label: string }[] = [
    { key: 'astar', label: t('algorithms.astar') },
    { key: 'dijkstra', label: t('algorithms.dijkstra') },
    { key: 'bfs', label: t('algorithms.bfs') },
    { key: 'dfs', label: t('algorithms.dfs') },
  ];

  return (
    <div className="flex min-w-48 flex-col gap-4">
      {/* Algorithm selector */}
      <Select
        label={t('algorithmLabel')}
        selectedKeys={new Set([algorithm])}
        onSelectionChange={selection => {
          if (selection === 'all') return;
          const [val] = [...selection] as [Algorithm];
          if (val) onAlgorithmChange(val);
        }}
        isDisabled={isAnimating}
        size="sm"
      >
        {algorithmOptions.map(opt => (
          <SelectItem key={opt.key}>{opt.label}</SelectItem>
        ))}
      </Select>

      {algorithm === 'dfs' && (
        <p className="text-warning-600 dark:text-warning-400 text-xs">
          {t('dfsWarning')}
        </p>
      )}

      {/* Speed slider */}
      <Slider
        label={t('speedLabel')}
        minValue={SPEED_VALUES.fast}
        maxValue={SPEED_VALUES.slow}
        step={1}
        value={speed}
        onChange={v => {
          onSpeedChange(typeof v === 'number' ? v : v[0]);
        }}
        isDisabled={isAnimating}
        size="sm"
        marks={[
          { value: SPEED_VALUES.slow, label: t('speedSlow') },
          { value: SPEED_VALUES.medium, label: t('speedMedium') },
          { value: SPEED_VALUES.fast, label: t('speedFast') },
        ]}
        renderValue={() => false}
      />

      {/* Grid size */}
      <div className="flex flex-col gap-2">
        <Slider
          label={`${t('rowsLabel')}: ${String(rows)}`}
          minValue={5}
          maxValue={40}
          step={1}
          value={rows}
          onChange={v => {
            onRowsChange(typeof v === 'number' ? v : v[0]);
          }}
          isDisabled={isAnimating}
          size="sm"
        />
        <Slider
          label={`${t('colsLabel')}: ${String(cols)}`}
          minValue={10}
          maxValue={70}
          step={1}
          value={cols}
          onChange={v => {
            onColsChange(typeof v === 'number' ? v : v[0]);
          }}
          isDisabled={isAnimating}
          size="sm"
        />
      </div>

      {/* Visualize / Stop */}
      {isAnimating ? (
        <Button
          color="warning"
          onPress={onStop}
          startContent={<StopIcon />}
          size="sm"
        >
          {t('stopButton')}
        </Button>
      ) : (
        <Button
          color="primary"
          onPress={onVisualize}
          startContent={<PlayIcon />}
          size="sm"
        >
          {t('visualizeButton')}
        </Button>
      )}

      {/* Generate Maze */}
      <Button
        variant="bordered"
        onPress={onGenerateMaze}
        isDisabled={isAnimating}
        startContent={<MazeIcon />}
        size="sm"
      >
        {t('generateMazeButton')}
      </Button>

      {/* Reset (keep walls) */}
      <Button
        variant="flat"
        onPress={onReset}
        isDisabled={isAnimating}
        size="sm"
      >
        {t('resetButton')}
      </Button>

      {/* Clear All */}
      <Button
        variant="flat"
        color="danger"
        onPress={onClearAll}
        isDisabled={isAnimating}
        startContent={<ClearIcon />}
        size="sm"
      >
        {t('clearAllButton')}
      </Button>

      {/* Legend */}
      <div className="border-default-200 flex flex-col gap-1.5 border-t pt-2">
        {(
          [
            ['bg-success-500', t('legend.start')],
            ['bg-danger-500', t('legend.end')],
            ['bg-default-600', t('legend.wall')],
            ['bg-primary-400', t('legend.visited')],
            ['bg-warning-400', t('legend.path')],
          ] as [string, string][]
        ).map(([color, label]) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span
              className={`inline-block h-3 w-3 shrink-0 rounded-sm ${color}`}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};
