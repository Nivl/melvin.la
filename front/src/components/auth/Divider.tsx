'use client';

import { Divider as NextDivider } from '@nextui-org/react';
export const Divider = ({ text }: { text: string }) => {
  return (
    <div className="my-4 flex items-center gap-4">
      <NextDivider className="shrink" />
      <span className="shrink-0 text-tiny uppercase text-default-500">
        {text}
      </span>
      <NextDivider className="shrink" />
    </div>
  );
};
