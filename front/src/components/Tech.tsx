import { Logo as LogoInfo } from '../models';
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
        inverted ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div className="grid grid-cols-3 pl-5 pr-10">
        {logos.map(logo => (
          <a
            key={logo.name}
            href={logo.url}
            className="grid w-40 justify-center border-none pt-8"
          >
            <Logo className="h-16 w-16 fill-white" name={logo.img} />
          </a>
        ))}
      </div>
      <div className={`w-2/3 ${inverted ? 'text-right' : 'text-left'}`}>
        <h2>{title}</h2>
        {content.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>
    </div>
  );
};
