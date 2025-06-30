import { Logo as LogoInfo } from '../../models';
import { Heading } from '../layout/Heading';
import { Logo } from './Logo';

export const Tech = ({
  title,
  logos,
  content,
  inverted = false,
}: {
  title: string;
  logos: LogoInfo[];
  content: string[];
  inverted?: boolean;
}) => {
  return (
    <div
      className={`flex items-center ${
        inverted
          ? 'flex-col-reverse md:flex-row-reverse'
          : 'flex-col-reverse md:flex-row'
      }`}
    >
      <div className="grid grid-cols-2 px-5 md:grid-cols-3 md:pl-5 md:pr-10">
        {logos.map(logo => (
          <a
            key={logo.name}
            href={logo.url}
            className={`grid w-28 border-none pt-4 md:w-40 md:pt-8 ${
              inverted
                ? 'justify-center'
                : 'justify-center md:justify-start lg:justify-center'
            }`}
          >
            <Logo
              className="h-16 w-16 fill-neutral-700 dark:fill-foreground"
              name={logo.img}
            />
          </a>
        ))}
      </div>
      <div className={`md:w-2/3 ${inverted ? 'text-right' : 'text-left'}`}>
        <Heading level={2}>{title}</Heading>
        {content.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>
    </div>
  );
};
