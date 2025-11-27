import { Chip } from '@heroui/chip';

export const Preset = ({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) => {
  return (
    <Chip className="cursor-pointer" onClick={onClick}>
      {name}
    </Chip>
  );
};
