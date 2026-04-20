"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { boardSizes, BoardValue, defaultPresets } from "#features/conway/models";
import { totalNeighbors } from "#features/conway/utils";
import { Heading } from "#shared/components/layout/Heading";
import { Section } from "#shared/components/layout/Section";

import { ConwayGrid } from "./Grid";
import { Side } from "./Side";

export const Conway = () => {
  const [board, setBoard] = useState(defaultPresets);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [boardSize, setBoardSize] = useState(boardSizes[0]);
  const [toroidal, setToroidal] = useState(true);
  const t = useTranslations("conway");

  const updateBoard = useCallback(() => {
    setBoard((current) =>
      current.map((row, y) =>
        row.map((cell, x) => {
          const neighbors = totalNeighbors(current, x, y, toroidal);
          if (cell === 1) return neighbors < 2 || neighbors > 3 ? 0 : 1;
          return neighbors === 3 ? 1 : 0;
        }),
      ),
    );
  }, [toroidal]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }
    const baseSpeed = 1000;
    const refreshRate = baseSpeed / speed;
    const interval = setInterval(updateBoard, refreshRate);
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, speed, updateBoard]);

  const handleSetCell = useCallback((row: number, col: number, value: BoardValue) => {
    setBoard((current) => {
      const next = current.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  }, []);

  return (
    <>
      <Section>
        <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
          {t("title")}
        </h1>
      </Section>

      <Section>
        <p>
          {t("whatIsIt")}

          {t.has("quoteUrl") && (
            <a className="text-nivl" href={t("quoteUrl")}>
              {t("quoteBy")}
            </a>
          )}
        </p>
      </Section>

      <Section>
        <Heading className="text-xl xl:text-2xl" level={2}>
          {t("howToPlay")}
        </Heading>
        <p>{t("rules.header")}</p>
        <ol className="my-5 list-inside list-decimal">
          <li>{t("rules.rule1")}</li>
          <li>{t("rules.rule2")}</li>
          <li>{t("rules.rule3")}</li>
          <li>{t("rules.rule4")}</li>
        </ol>
        <p>{t("rules.footer")}</p>
        <p className="my-5">{t("gridInfo")}</p>
      </Section>

      <Section>
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-center lg:gap-10">
          <div className="min-w-0 flex-1 lg:max-w-[701px]">
            <ConwayGrid
              board={board}
              boardSize={boardSize}
              isPlaying={isPlaying}
              ariaLabel={t("gridLabel")}
              onSetCell={handleSetCell}
            />
          </div>

          <div className="flex flex-col gap-7 lg:min-w-56">
            <Side
              board={board}
              setBoard={setBoard}
              speed={speed}
              setSpeed={setSpeed}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              boardSize={boardSize}
              setBoardSize={setBoardSize}
              toroidal={toroidal}
              setToroidal={setToroidal}
            />
          </div>
        </div>
      </Section>
    </>
  );
};
