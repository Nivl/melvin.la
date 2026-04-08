import { Chip } from "@heroui/react";

export const Preset = ({ name, onClick }: { name: string; onClick: () => void }) => {
  return (
    <Chip className="cursor-pointer p-2" onClick={onClick}>
      {name}
    </Chip>
  );
};
