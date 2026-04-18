"use client";

import { Button, Card, TextArea, Tooltip } from "@heroui/react";
import { BadgeInfo } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Section } from "#shared/components/layout/Section";

export const StringLength = () => {
  const t = useTranslations("stringLength");
  const [text, setText] = useState("");

  const textAreaId = useId();

  // Count Unicode characters (each character is 1, regardless of bytes)
  const characterCount = text.length;

  // Count bytes using TextEncoder
  const byteCount = new TextEncoder().encode(text).length;

  // Count words (split by whitespace and filter out empty strings)
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  return (
    <>
      <Section>
        <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
          {t("title")}
        </h1>
      </Section>

      <Section>
        <div className="flex flex-col items-center justify-center gap-6">
          <TextArea
            id={textAreaId}
            name="input-textarea"
            className="w-full max-w-[600px] items-center justify-center"
            aria-label={t("inputPlaceholder")}
            placeholder={t("inputPlaceholder")}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            rows={7}
            data-testid="string-input"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 lg:grid lg:grid-cols-3">
            <Card className="w-full max-w-[280px]">
              <Card.Content className="text-center">
                <div className="text-2xl font-bold">{characterCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("characterCount")}
                </div>
              </Card.Content>
            </Card>

            <Card className="w-full max-w-[280px]">
              <Card.Content className="text-center">
                <div className="text-2xl font-bold">{wordCount}</div>
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                  {t("word-count")}
                  <Tooltip delay={0}>
                    <Button isIconOnly variant="ghost" className="h-3 w-3">
                      <BadgeInfo className="h-3 w-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                    </Button>
                    <Tooltip.Content>
                      <p>{t("wordCountTooltip")}</p>
                    </Tooltip.Content>
                  </Tooltip>
                </div>
              </Card.Content>
            </Card>

            <Card className="w-full max-w-[280px]">
              <Card.Content className="text-center">
                <div className="text-2xl font-bold">{byteCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("byteCount")}</div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
};
