'use client';

import { Card, CardBody } from '@heroui/card';
import { Textarea } from '@heroui/input';
import { Tooltip } from '@heroui/tooltip';
import { BadgeInfo } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Section } from '../layout/Section';

export const StringLength = () => {
  const t = useTranslations('stringLength');
  const [text, setText] = useState<string>('');

  // Count Unicode characters (each character is 1, regardless of bytes)
  const characterCount = text.length;

  // Count bytes using TextEncoder
  const byteCount = new TextEncoder().encode(text).length;

  // Count words (split by whitespace and filter out empty strings)
  const wordCount =
    text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  return (
    <>
      <Section>
        <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl font-bold uppercase sm:text-8xl xl:text-9xl">
          {t('title')}
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col items-center justify-center gap-6">
          <Textarea
            label={t('inputLabel')}
            placeholder={t('inputPlaceholder')}
            size="lg"
            className="max-w-[600px]"
            minRows={4}
            maxRows={8}
            value={text}
            onValueChange={setText}
            data-testid="string-input"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 lg:grid lg:grid-cols-3">
            <Card className="w-full max-w-[280px]">
              <CardBody className="text-center">
                <div className="text-2xl font-bold">{characterCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('characterCount')}
                </div>
              </CardBody>
            </Card>

            <Card className="w-full max-w-[280px]">
              <CardBody className="text-center">
                <div className="text-2xl font-bold">{wordCount}</div>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('word-count')}
                  <Tooltip
                    showArrow
                    placement="top"
                    content={t('wordCountTooltip')}
                  >
                    <BadgeInfo className="h-3 w-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                  </Tooltip>
                </div>
              </CardBody>
            </Card>

            <Card className="w-full max-w-[280px]">
              <CardBody className="text-center">
                <div className="text-2xl font-bold">{byteCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('byteCount')}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
};
