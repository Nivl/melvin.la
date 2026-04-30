"use client";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

import { PRESETS } from "#features/beatmaker/models/index.ts";

type PresetKey = keyof typeof PRESETS;

const isPresetKey = (id: string): id is PresetKey => Object.hasOwn(PRESETS, id);

type PatternPresetsProps = {
  onPresetSelect: (presetId: string) => void;
};

export const PatternPresets = ({ onPresetSelect }: PatternPresetsProps) => {
  const t = useTranslations("beatmaker.presets");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-default-500 text-sm">{t("label")}</span>
      {Object.keys(PRESETS).map((id) => (
        <Button
          key={id}
          size="sm"
          variant="outline"
          onPress={() => {
            onPresetSelect(id);
          }}
        >
          {isPresetKey(id) ? t(id) : id}
        </Button>
      ))}
    </div>
  );
};
