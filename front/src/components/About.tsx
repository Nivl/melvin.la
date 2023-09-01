import Image from 'next/image';

import ProfilePicture from './melvin.jpg';

export const About = ({
  title,
  content,
  linkedInUrl,
}: {
  title: string;
  content: string;
  linkedInUrl: string;
}) => {
  return (
    <div>
      <div className="flex flex-col items-center md:flex-row">
        <div className="md:text-right">
          <h2> {title} </h2>
          <p> {content} </p>
          <div className="flex items-center justify-end text-base font-bold uppercase">
            <a
              href={linkedInUrl}
              className="border-none text-accent visited:text-accent"
            >
              Checkout my LinkedIn
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
