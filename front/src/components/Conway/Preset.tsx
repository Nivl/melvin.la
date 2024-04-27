import { Card, CardFooter, Image } from '@nextui-org/react';

export const Preset = ({
  name,
  imgUrl,
  alt,
  onClick,
}: {
  name: string;
  alt: string;
  imgUrl: string;
  onClick: () => void;
}) => {
  return (
    <Card
      isPressable
      isFooterBlurred
      radius="lg"
      className="h-[100px] w-[100px] border-none"
      onClick={onClick}
    >
      <Image
        alt={alt}
        className="object-cover"
        height={400}
        src={imgUrl}
        width={400}
      />
      <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-center overflow-hidden rounded-large border-1 border-white/20 bg-black/50 py-1 shadow-small before:rounded-xl before:bg-white/10">
        <p className="text-tiny text-white/80">{name}</p>
      </CardFooter>
    </Card>
  );
};
