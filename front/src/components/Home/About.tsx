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
      <div className="flex items-center">
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
      </div>
    </div>
  );
};
