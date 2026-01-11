'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Board, boardSizes, defaultPresets } from '#models/conway';

import { Heading } from '../layout/Heading';
import { Section } from '../layout/Section';
import { Canvas } from './Canvas';
import { Side } from './Side';

export const Conway = () => {
  const [board, setBoard] = useState<Board>(defaultPresets);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [boardSize, setBoardSize] = useState(boardSizes[0]);
  const t = useTranslations('conway');

  return (
    <>
      <Section className="lg:hidden">
        <div className="text-center">{t('needLargeScreen')}</div>
      </Section>

      <div className="hidden lg:block">
        <Section>
          <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl uppercase sm:text-8xl xl:text-9xl">
            {t('title')}
          </h1>
        </Section>

        <Section>
          <p>
            {t('whatIsIt')}

            {t.has('quoteUrl') && (
              <a className="text-accent" href={t('quoteUrl')}>
                {t('quoteBy')}
              </a>
            )}
          </p>
        </Section>

        <Section>
          <Heading className="text-xl xl:text-2xl" level={2}>
            {t('howToPlay')}
          </Heading>
          <p>{t('rules.header')}</p>
          <ol className="my-5 list-inside list-decimal">
            <li>{t('rules.rule1')}</li>
            <li>{t('rules.rule2')}</li>
            <li>{t('rules.rule3')}</li>
            <li>{t('rules.rule4')}</li>
          </ol>
          <p>{t('rules.footer')}</p>
          <p className="my-5">{t('gridInfo')}</p>
        </Section>

        <Section fullScreen>
          <div className="flex flex-row justify-center gap-10">
            <Canvas
              width="701px"
              height="701px"
              className="h-[701px] w-[701px]"
              board={board}
              setBoard={setBoard}
              speed={speed}
              isPlaying={isPlaying}
              boardSize={boardSize}
            />

            <div className="flex min-w-56 flex-col gap-7">
              <Side
                board={board}
                setBoard={setBoard}
                speed={speed}
                setSpeed={setSpeed}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                boardSize={boardSize}
                setBoardSize={setBoardSize}
              />
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};
