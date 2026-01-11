import { useTranslations } from 'next-intl';
import { PiHandPeaceLight as PeaceIcon } from 'react-icons/pi';

import { Heading } from '../layout/Heading';

export const About = () => {
  const t = useTranslations('home.aboutme');

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row">
        <div className="md:text-right">
          <Heading level={2}>{t('title')}</Heading>
          <p> {t('content')} </p>
          <div className="flex items-center justify-end text-base font-bold uppercase">
            <a
              href="https://github.com/Nivl"
              className="text-accent visited:text-accent border-none"
            >
              {t('cta')}
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
