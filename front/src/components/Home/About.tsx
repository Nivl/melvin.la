import { PiHandPeaceLight as PeaceIcon } from 'react-icons/pi';

import { CTA } from '../../models';
import { Heading } from './Heading';

export const About = ({
  title,
  content,
  cta,
}: {
  title: string;
  content: string;
  cta: CTA;
}) => {
  return (
    <div>
      <div className="flex flex-col items-center md:flex-row">
        <div className="md:text-right">
          <Heading level={2}>{title}</Heading>
          <p> {content} </p>
          <div className="flex items-center justify-end text-base font-bold uppercase">
            <a
              href={cta.url}
              className="border-none text-accent visited:text-accent"
            >
              {cta.text}
            </a>
          </div>
        </div>
        <div className="ml-12 hidden dark:hidden md:block">
          <PeaceIcon className="h-56 w-56 fill-neutral-700 drop-shadow-lg dark:fill-foreground" />
        </div>
      </div>
    </div>
  );
};
