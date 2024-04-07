import Image from 'next/image';

import { CTA } from '../../models';
import { Heading } from './Heading';
import ProfilePicture from './melvin.jpg';

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
        <div className="ml-12 hidden md:block">
          <Image
            className="block max-w-none rounded-full md:w-52 xl:w-80"
            src={ProfilePicture}
            alt="me"
          />
        </div>
      </div>
    </div>
  );
};
