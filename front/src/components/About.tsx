import Image from 'next/image';

import ProfilePicture from '../melvin.jpg';
import AngleRightIcon from './svg/angle-right-icon.svg';

export const About = ({
  title,
  content,
  linkedInUrl,
}: {
  title: string;
  content: string;
  linkedInUrl: string;
  blogUrl: string;
}) => {
  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="text-right">
          <h2> {title} </h2>
          <p> {content} </p>
          <div className="flex items-center justify-end text-base font-bold uppercase">
            <a href={linkedInUrl} className="text-accent visited:text-accent">
              Checkout my LinkedIn
            </a>
          </div>
        </div>
        <div className="ml-12 w-80">
          <Image
            className="block w-80 max-w-none rounded-full"
            src={ProfilePicture}
            alt="me"
          />
        </div>
      </div>
    </div>
  );
};
