'use client';
import { Button } from '@heroui/button';
import { useTranslations } from 'next-intl';

import { KITS, type Kit } from '#models/beatmaker';

type KitSelectorProps = {
  activeKit: Kit;
  onKitChange: (kit: Kit) => void;
};

export function KitSelector({ activeKit, onKitChange }: KitSelectorProps) {
  const t = useTranslations('beatmaker.kits');
  return (
    <div className="flex gap-2">
      {(Object.keys(KITS) as Kit[]).map(id => (
        <Button
          key={id}
          size="sm"
          variant="bordered"
          color={activeKit === id ? 'primary' : 'default'}
          onPress={() => {
            onKitChange(id);
          }}
        >
          {t(id)}
        </Button>
      ))}
    </div>
  );
}
