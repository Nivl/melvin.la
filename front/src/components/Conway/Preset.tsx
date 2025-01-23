import { Chip } from '@heroui/chip';

export const Preset = ({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) => {
  return <Chip onClick={onClick}>{name}</Chip>;
};
