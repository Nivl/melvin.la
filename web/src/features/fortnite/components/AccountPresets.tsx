import { Avatar, Button, Tooltip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { AccountTypes, TimeWindow } from "./Form";

export type Preset = {
  accountName: string;
  accountType: AccountTypes;
  timeWindow: TimeWindow;
};

export const defaults: Preset = {
  accountName: "",
  accountType: AccountTypes.Epic,
  timeWindow: TimeWindow.Lifetime,
};

const presetLists: {
  key: string;
  data: Preset;
  name: string;
  picture: string;
}[] = [
  {
    key: crypto.randomUUID(),
    name: "Nikof",
    picture:
      "https://yt3.googleusercontent.com/2mxiF3jOPiZcd-FjQ-rmSuE9t_RiOBqoPgiJsHMxdR0_wovWqHwOA-xGzz3pxmqxPXIsamsI=s160-c-k-c0x00ffffff-no-rj",
    data: {
      accountName: "M8 Nîkof",
      accountType: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
    },
  },
  {
    key: crypto.randomUUID(),
    name: "Mongraal",
    picture:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/d378b8b2-d06f-46df-a4e5-15e46c60e0b5-profile_image-70x70.jpeg",
    data: {
      accountName: "Mongraal",
      accountType: AccountTypes.Xbox,
      timeWindow: TimeWindow.Lifetime,
    },
  },
  {
    key: crypto.randomUUID(),
    name: "Aussie Antics",
    picture:
      "https://yt3.googleusercontent.com/AvhJUD0eAio7gb3a39GfSuf7Fpdf4cEZlCqSkvastLXOjBrdDR2t59h9_MRc3MEfvM8-SJ0d=s160-c-k-c0x00ffffff-no-rj",
    data: {
      accountName: "DIG Aussie1X",
      accountType: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
    },
  },
  {
    key: crypto.randomUUID(),
    name: "Talmo",
    picture:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/b310031d-5759-47bd-89b4-3c3e8c613351-profile_image-70x70.png",
    data: {
      accountName: "solo talmo",
      accountType: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
    },
  },
];

export const AccountPresets = ({ setPreset }: { setPreset: (p: Preset) => void }) => {
  const t = useTranslations("fortnite");
  const Presets = useMemo(() => {
    return presetLists.map((preset) => (
      <Tooltip key={preset.key} delay={0}>
        <Button
          className="h-full p-0"
          onPress={() => {
            setPreset({ ...preset.data });
          }}
        >
          <Avatar className="text-large h-20 w-20 cursor-pointer rounded-lg">
            <Avatar.Image alt={preset.name} src={preset.picture} />
            <Avatar.Fallback className="rounded-lg">{preset.name}</Avatar.Fallback>
          </Avatar>
        </Button>

        <Tooltip.Content showArrow placement="bottom" offset={12}>
          <Tooltip.Arrow />
          <p>{preset.name}</p>
        </Tooltip.Content>
      </Tooltip>
    ));
  }, [setPreset]);

  return (
    <>
      <h2 className="text-center text-2xl font-extrabold">{t("presets")}</h2>
      <div className="flex flex-col items-center justify-center gap-10 sm:flex-row">{Presets}</div>
    </>
  );
};
