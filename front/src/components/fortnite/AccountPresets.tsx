import { Avatar, Tooltip } from '@nextui-org/react';
import { useMemo } from 'react';

import { AccountTypes, TimeWindow } from './Form';

type Preset = {
  accountName: string;
  accountType: AccountTypes;
  timeWindow: TimeWindow;
};

export const defaults: Preset = {
  accountName: '',
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
    name: 'Nikof',
    picture:
      'https://yt3.googleusercontent.com/OJFpkcyoN3FHwsFc1v8EBkD4aSyKvUTkd8NL6jrKku85Jd99h8MwRTYJP5m37NXBhFprZW9SxA=s176-c-k-c0x00ffffff-no-rj',
    data: {
      accountName: 'M8 Nîkof',
      accountType: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
    },
  },
  {
    key: crypto.randomUUID(),
    name: 'Mongraal',
    picture:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/d378b8b2-d06f-46df-a4e5-15e46c60e0b5-profile_image-70x70.jpeg',
    data: {
      accountName: 'Mongraal',
      accountType: AccountTypes.Xbox,
      timeWindow: TimeWindow.Lifetime,
    },
  },
  {
    key: crypto.randomUUID(),
    name: 'Aussie Antics',
    picture:
      'https://yt3.googleusercontent.com/gxSnaytdtO70nd4_MydIjGo4_6DTSpkk662Rm5wx6DXIpKLF_X5UVSSfHNRZqMMlI8fZGl_iGg=s176-c-k-c0x00ffffff-no-rj',
    data: {
      accountName: 'DIG Aussie',
      accountType: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
    },
  },
  {
    key: crypto.randomUUID(),
    name: 'Talmo',
    picture:
      'https://yt3.googleusercontent.com/8LgVp8ccwAc-TRMxCqPJD3yjL_o4VRP96aWckgvbSo-88cpwI4yNhIGvgbZB6ncGgDZhpiK_q0Y=s176-c-k-c0x00ffffff-no-rj',
    data: {
      accountName: 'solo talmo',
      accountType: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
    },
  },
];

export const AccountPresets = ({
  setPreset,
}: {
  setPreset: (p: Preset) => void;
}) => {
  const Presets = useMemo(() => {
    return presetLists.map(preset => (
      <Tooltip
        showArrow
        closeDelay={0}
        placement="bottom"
        key={preset.key}
        content={preset.name}
      >
        <Avatar
          onClick={() => {
            setPreset({ ...preset.data });
          }}
          isBordered
          radius="lg"
          name={preset.name}
          src={preset.picture}
          className="h-20 w-20 cursor-pointer text-large"
        />
      </Tooltip>
    ));
  }, [setPreset]);

  return (
    <>
      <h2 className="text-center text-2xl font-black">
        Or pick a famous content creator
      </h2>
      <div className="flex flex-col items-center justify-center gap-10 sm:flex-row">
        {Presets}
      </div>
    </>
  );
};