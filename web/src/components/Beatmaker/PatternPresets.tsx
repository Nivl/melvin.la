"use client";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

import { PRESETS } from "#models/beatmaker";

type PresetKey = "basic-rock" | "four-on-floor" | "boom-bap" | "trap" | "blank";

const PRESET_KEYS = new Set<PresetKey>([
  "basic-rock",
  "four-on-floor",
  "boom-bap",
  "trap",
  "blank",
]);

function isPresetKey(id: string): id is PresetKey {
  return PRESET_KEYS.has(id as PresetKey);
}

type PatternPresetsProps = {
  onPresetSelect: (presetId: string) => void;
};

export function PatternPresets({ onPresetSelect }: PatternPresetsProps) {
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
}
