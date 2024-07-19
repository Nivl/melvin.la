import { Chip } from '@nextui-org/chip';

export const Preset = ({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) => {
  return <Chip onClick={onClick}>{name}</Chip>;
};
