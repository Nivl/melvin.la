"use client";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { Kit } from "#features/beatmaker/models/index.ts";
import { KIT_IDS } from "#features/beatmaker/models/index.ts";

type KitSelectorProps = {
  activeKit: Kit;
  onKitChange: (kit: Kit) => void;
};

export const KitSelector = ({ activeKit, onKitChange }: KitSelectorProps) => {
  const t = useTranslations("beatmaker.kits");
  return (
    <div className="flex gap-2">
      {KIT_IDS.map((id) => (
        <Button
          key={id}
          size="sm"
          variant={activeKit === id ? "primary" : "outline"}
          onPress={() => {
            onKitChange(id);
          }}
        >
          {t(id)}
        </Button>
      ))}
    </div>
  );
};
