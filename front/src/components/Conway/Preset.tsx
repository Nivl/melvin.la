import { Chip } from '@heroui/react';

export const Preset = ({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) => {
  return <Chip onClick={onClick}>{name}</Chip>;
};
