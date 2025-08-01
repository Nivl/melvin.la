import { PiHandPeaceLight as PeaceIcon } from 'react-icons/pi';

import { CTA } from '../../models';
import { Heading } from '../layout/Heading';

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
              className="text-accent visited:text-accent border-none"
            >
              {cta.text}
            </a>
          </div>
        </div>
        <div className="ml-12 hidden md:block dark:hidden">
          <PeaceIcon className="dark:fill-foreground h-56 w-56 fill-neutral-700 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
};
