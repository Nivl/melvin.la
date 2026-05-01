"use client";

import {
  Button,
  ButtonGroup,
  Description,
  Label,
  ListBox,
  Select,
  Separator,
  Slider,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaPlay as PlayIcon, FaStop as StopIcon } from "react-icons/fa6";
import { GiMaze as MazeIcon } from "react-icons/gi";
import { MdClear as ClearIcon } from "react-icons/md";

import type { Algorithm, PlacementMode } from "#features/pathfinding/utils/types.ts";
import { CELL_COLORS, SPEED_VALUES } from "#features/pathfinding/utils/types.ts";

const GRID_SIZE_CONSTRAINTS = {
  MAX_COLS: 70,
  MAX_ROWS: 40,
  MIN_COLS: 10,
  MIN_ROWS: 5,
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
  hasPath: boolean;
  placementMode: PlacementMode;
  onPlacementModeChange: (mode: PlacementMode) => void;
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
  hasPath,
  placementMode,
  onPlacementModeChange,
  onVisualize,
  onStop,
  onReset,
  onClearAll,
  onGenerateMaze,
}: ControlsProps) => {
  const t = useTranslations("pathfinding");

  const algorithmOptions: { key: Algorithm; label: string }[] = [
    { key: "astar", label: t("algorithms.astar") },
    { key: "dijkstra", label: t("algorithms.dijkstra") },
    { key: "bfs", label: t("algorithms.bfs") },
    { key: "dfs", label: t("algorithms.dfs") },
  ];

  return (
    <div className="flex min-w-48 flex-col gap-4">
      {/* Algorithm selector */}
      <Select
        className="w-[256px]"
        isDisabled={isAnimating}
        value={algorithm}
        onChange={(selection) => {
          if (selection === "all") {
            return;
          }
          if (
            selection === "astar" ||
            selection === "dijkstra" ||
            selection === "bfs" ||
            selection === "dfs"
          ) {
            onAlgorithmChange(selection);
          }
        }}
      >
        <Label>{t("algorithmLabel")}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {algorithmOptions.map((opt) => (
              <ListBox.Item key={opt.key} id={opt.key} textValue={opt.label}>
                {opt.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
        {algorithm === "dfs" && <Description> {t("dfsWarning")}</Description>}
      </Select>

      {/* Speed slider
      
        This is actually hacky because the speed works in a way that lower is
        faster, but the slider intuitively should work the other way around.

        So the minValue is still mapped to fast, and maxValue is still
        mapped to slow, but from a UI perspective, when the user moves the
        slider to the right (toward maxValue, so slow), we actually do 
        some math to invert the value and make it faster.
      
      */}
      <Slider
        minValue={SPEED_VALUES.fast}
        maxValue={SPEED_VALUES.slow}
        step={1}
        value={SPEED_VALUES.fast + SPEED_VALUES.slow - speed}
        onChange={(v) => {
          const raw = typeof v === "number" ? v : v[0];
          onSpeedChange(SPEED_VALUES.fast + SPEED_VALUES.slow - raw);
        }}
        isDisabled={isAnimating}
      >
        <Label>{t("speedLabel")}</Label>
        <Slider.Output>
          {/* The percentage is computed so that 100% = fastest (SPEED_VALUES.fast = 5)
              and ~6% = slowest (SPEED_VALUES.slow = 80). The minimum never reaches 0%
              because SPEED_VALUES.fast is added to the numerator as a floor, ensuring
              the animation always advances even at the slowest setting. */}
          {(((SPEED_VALUES.fast + SPEED_VALUES.slow - speed) / SPEED_VALUES.slow) * 100).toFixed(0)}
          %
        </Slider.Output>
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      {/* Grid size */}
      <Slider
        minValue={GRID_SIZE_CONSTRAINTS.MIN_ROWS}
        maxValue={GRID_SIZE_CONSTRAINTS.MAX_ROWS}
        step={1}
        value={rows}
        onChange={(v) => {
          onRowsChange(typeof v === "number" ? v : v[0]);
        }}
        isDisabled={isAnimating}
      >
        <Label>{t("rowsLabel")}</Label>
        <Slider.Output />
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      <Slider
        minValue={GRID_SIZE_CONSTRAINTS.MIN_COLS}
        maxValue={GRID_SIZE_CONSTRAINTS.MAX_COLS}
        step={1}
        value={cols}
        onChange={(v) => {
          onColsChange(typeof v === "number" ? v : v[0]);
        }}
        isDisabled={isAnimating}
      >
        <Label>{t("colsLabel")}</Label>
        <Slider.Output />
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      <Separator variant="tertiary" />

      {/* Mode selector */}
      <ButtonGroup variant="outline" isDisabled={isAnimating} size="sm" fullWidth>
        <Button
          className="text-xs"
          variant={placementMode === "draw-walls" ? "primary" : "outline"}
          onPress={() => {
            onPlacementModeChange("draw-walls");
          }}
        >
          {t("drawWallsButton")}
        </Button>
        <Button
          className="text-xs"
          variant={placementMode === "place-start" ? "primary" : "outline"}
          onPress={() => {
            onPlacementModeChange("place-start");
          }}
        >
          <ButtonGroup.Separator />
          {t("placeStartButton")}
        </Button>
        <Button
          className="text-xs"
          variant={placementMode === "place-end" ? "primary" : "outline"}
          onPress={() => {
            onPlacementModeChange("place-end");
          }}
        >
          <ButtonGroup.Separator />
          {t("placeEndButton")}
        </Button>
      </ButtonGroup>

      <Separator variant="tertiary" />

      {/* Generate Maze */}
      <Button
        size="sm"
        variant="outline"
        className="w-full text-xs"
        onPress={onGenerateMaze}
        isDisabled={isAnimating}
      >
        <MazeIcon className="w-3" />
        {t("generateMazeButton")}
      </Button>

      {/* Visualize / Stop */}
      {isAnimating ? (
        <Button
          size="sm"
          variant="danger"
          className="w-full text-xs"
          onPress={onStop}
          isDisabled={!isAnimating}
        >
          <StopIcon className="w-3" />
          {t("stopButton")}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="primary"
          className="w-full text-xs"
          onPress={onVisualize}
          isDisabled={isAnimating}
        >
          <PlayIcon className="h-3" />
          {t("visualizeButton")}
        </Button>
      )}
      {/* Clear Path */}
      {hasPath && (
        <Button
          size="sm"
          variant="tertiary"
          className="w-full text-xs"
          onPress={onReset}
          isDisabled={isAnimating}
        >
          {t("resetButton")}
        </Button>
      )}
      {/* Clear All */}
      <Button
        size="sm"
        variant="danger"
        className="w-full text-xs"
        onPress={onClearAll}
        isDisabled={isAnimating}
      >
        <ClearIcon className="w-3" />
        {t("clearAllButton")}
      </Button>

      <Separator variant="tertiary" />

      {/* Legend */}
      <div className="flex flex-col gap-1.5">
        {(
          [
            [CELL_COLORS.start, t("legend.start")],
            [CELL_COLORS.end, t("legend.end")],
            [CELL_COLORS.wall, t("legend.wall")],
            [CELL_COLORS.visited, t("legend.visited")],
            [CELL_COLORS.path, t("legend.path")],
          ] as [string, string][]
        ).map(([color, label]) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className={`inline-block h-3 w-3 shrink-0 rounded-sm ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};
