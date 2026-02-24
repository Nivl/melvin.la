'use client';

import { Input } from '@heroui/input';
import { Slider } from '@heroui/slider';
import { range as esRange, shuffle } from 'es-toolkit';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Heading } from '../layout/Heading';
import { Logo } from './Logo';

type UsageType = 'professional' | 'personal' | 'openSource';

type SkillData = {
  name: string;
  url: string;
  logo: string;
  logoColor?: string;
  usages: {
    years: number[];
    type: UsageType;
  }[];
};

const range = (from: number, to: number | 'now') => {
  const target = to === 'now' ? new Date().getFullYear() : to;
  return esRange(from, target + 1);
};

const skillsData: SkillData[] = [
  {
    name: 'PHP',
    url: 'https://www.php.net',
    logo: 'php',
    logoColor: 'fill-tech-php',
    usages: [
      {
        years: [2011, 2013],
        type: 'professional',
      },
      {
        years: [...range(2004, 2010)],
        type: 'personal',
      },
      {
        years: [...range(2004, 2010)],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Emacs Lisp',
    url: 'https://en.wikipedia.org/wiki/Emacs_Lisp',
    logo: 'emacslisp',
    usages: [
      {
        years: [...range(2010, 2013)],
        type: 'personal',
      },
      {
        years: [2011],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Python',
    url: 'https://www.python.org/',
    logo: 'python',
    usages: [
      {
        years: [...range(2011, 2014)],
        type: 'professional',
      },
      {
        years: [...range(2010, 2014)],
        type: 'personal',
      },
      {
        years: [2012, 2013],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Django',
    url: 'https://www.djangoproject.com/',
    logo: 'django',
    logoColor: 'fill-tech-django dark:fill-foreground',
    usages: [
      {
        years: [2011, 2013, 2014],
        type: 'professional',
      },
      {
        years: [...range(2005, 2013)],
        type: 'personal',
      },
      {
        years: [2012, 2013],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Java',
    url: 'https://www.java.com/',
    logo: 'java',
    usages: [
      {
        years: [...range(2014, 2016)],
        type: 'professional',
      },
      {
        years: [2013, 2014],
        type: 'personal',
      },
      {
        years: [2015],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Ionic',
    url: 'https://ionicframework.com',
    logo: 'ionic',
    logoColor: 'fill-tech-ionic',
    usages: [
      {
        years: [...range(2014, 2015)],
        type: 'professional',
      },
      {
        years: [2014],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Javascript',
    url: 'https://en.wikipedia.org/wiki/JavaScript',
    logo: 'javascript',
    logoColor: 'fill-tech-javascript',
    usages: [
      {
        years: [...range(2013, 'now')],
        type: 'professional',
      },
      {
        years: [...range(2005, 'now')],
        type: 'personal',
      },
      {
        years: [2014, 2023],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Android',
    url: 'https://developer.android.com/',
    logo: 'android',
    logoColor: 'fill-tech-android',
    usages: [
      {
        years: [...range(2014, 2016)],
        type: 'professional',
      },
      {
        years: [2015],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Go',
    url: 'https://golang.org',
    logo: 'go',
    logoColor: 'fill-tech-go',
    usages: [
      {
        years: [...range(2016, 2025)],
        type: 'professional',
      },
      {
        years: [...range(2015, 'now')],
        type: 'personal',
      },
      {
        years: [2016, 2018, 2019, 2020, 2021, 2024, 2025],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Typescript',
    url: 'https://www.typescriptlang.org',
    logo: 'typescript',
    logoColor: 'fill-tech-typescript',
    usages: [
      {
        years: [...range(2016, 'now')],
        type: 'professional',
      },
      {
        years: [...range(2016, 'now')],
        type: 'personal',
      },
      {
        years: [2012],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'ReactJS',
    url: 'https://reactjs.org',
    logo: 'reactjs',
    logoColor: 'fill-tech-react',
    usages: [
      {
        years: [...range(2018, 'now')],
        type: 'professional',
      },
      {
        years: [...range(2017, 'now')],
        type: 'personal',
      },
    ],
  },
  {
    name: 'NodeJS',
    url: 'https://nodejs.org',
    logo: 'nodejs',
    logoColor: 'fill-tech-node',
    usages: [
      {
        years: [...range(2013, 'now')],
        type: 'professional',
      },
      {
        years: [...range(2013, 'now')],
        type: 'personal',
      },
    ],
  },
  {
    name: 'C',
    url: 'https://en.wikipedia.org/wiki/C_(programming_language)',
    logo: 'c',
    usages: [
      {
        years: [...range(2005, 2013)],
        type: 'personal',
      },
    ],
  },
  {
    name: 'Objective-C',
    url: 'https://en.wikipedia.org/wiki/Objective-C',
    logo: 'objc',
    usages: [
      {
        years: [2018, 2019, 2020],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Amplitude',
    url: 'https://amplitude.com',
    logo: 'amplitude',
    logoColor: 'fill-tech-amplitude',
    usages: [
      {
        years: [...range(2018, 'now')],
        type: 'professional',
      },
    ],
  },
  {
    name: 'C++',
    url: 'https://en.wikipedia.org/wiki/C%2B%2B',
    logo: 'cpp',
    usages: [
      {
        years: [...range(2005, 2013)],
        type: 'personal',
      },
    ],
  },
  {
    name: 'C#',
    url: 'https://en.wikipedia.org/wiki/C_Sharp_(programming_language)',
    logo: 'csharp',
    usages: [
      {
        years: [2016, 2017, 2018],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Swift',
    url: 'https://developer.apple.com/swift',
    logo: 'swift',
    usages: [
      {
        years: [...range(2014, 2016)],
        type: 'professional',
      },
    ],
  },
  {
    name: 'iOS',
    url: 'https://developer.apple.com/ios/',
    logo: 'apple',
    usages: [
      {
        years: [...range(2014, 2016)],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Redis',
    url: 'https://redis.io',
    logo: 'redis',
    logoColor: 'fill-tech-redis',
    usages: [
      {
        years: [...range(2016, 'now')],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Ruby',
    url: 'https://www.ruby-lang.org',
    logo: 'ruby',
    logoColor: 'fill-tech-ruby',
    usages: [
      {
        years: [...range(2018, 2020)],
        type: 'personal',
      },
    ],
  },
  {
    name: 'Rails',
    url: 'https://rubyonrails.org/',
    logo: 'rails',
    logoColor: 'fill-tech-rails',
    usages: [
      {
        years: [...range(2018, 2020)],
        type: 'personal',
      },
    ],
  },
  {
    name: 'Clojure',
    url: 'https://clojure.org',
    logo: 'clojure',
    usages: [
      {
        years: [2021, 2022, 2023],
        type: 'professional',
      },
      {
        years: [2026],
        type: 'openSource',
      },
    ],
  },
  {
    name: 'Sentry',
    url: 'https://sentry.io',
    logo: 'sentry',
    logoColor: 'fill-tech-sentry-light dark:fill-foreground',
    usages: [
      {
        years: [2018, 2019, 2020],
        type: 'professional',
      },
      {
        years: [2016, 2017, 2018, 2026],
        type: 'personal',
      },
    ],
  },
  {
    name: 'OpenAI',
    url: 'https://openai.com/api',
    logo: 'openai',
    usages: [
      {
        years: [2025, 2026],
        type: 'professional',
      },
    ],
  },
  {
    name: 'ElevenLabs',
    url: 'https://elevenlabs.io/',
    logo: 'elevenlabs',
    usages: [
      {
        years: [2025, 2026],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Angular',
    url: 'https://angular.dev',
    logo: 'angular',
    logoColor: 'fill-tech-angular',
    usages: [
      {
        years: [...range(2014, 2018)],
        type: 'professional',
      },
      {
        years: [2013, 2014],
        type: 'personal',
      },
    ],
  },
  {
    name: 'Symfony',
    url: 'https://symfony.com',
    logo: 'symfony',
    usages: [
      {
        years: [2013],
        type: 'professional',
      },
    ],
  },
  {
    name: 'New Relic',
    url: 'https://newrelic.com',
    logo: 'newrelic',
    usages: [
      {
        years: [...range(2016, 2018)],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Electron',
    url: 'https://electronjs.org',
    logo: 'electron',
    usages: [
      {
        years: [...range(2016, 2020)],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Datadog',
    url: 'https://datadoghq.com',
    logo: 'datadog',
    logoColor: 'fill-tech-datadog dark:fill-foreground',
    usages: [
      {
        years: [...range(2018, 'now')],
        type: 'professional',
      },
    ],
  },
  {
    name: 'Docker',
    url: 'https://www.docker.com',
    logo: 'docker',
    logoColor: 'fill-tech-docker',
    usages: [
      {
        years: [...range(2016, 'now')],
        type: 'professional',
      },
      {
        years: [...range(2016, 'now')],
        type: 'personal',
      },
    ],
  },
  {
    name: 'PostgreSQL',
    url: 'https://www.postgresql.org',
    logo: 'postgres',
    logoColor: 'fill-tech-postgres',
    usages: [
      {
        years: [...range(2018, 'now')],
        type: 'professional',
      },
      {
        years: [...range(2016, 'now')],
        type: 'personal',
      },
    ],
  },
  {
    name: 'MySQL',
    url: 'https://www.mysql.com',
    logo: 'mysql',
    logoColor: 'fill-tech-mysql',
    usages: [
      {
        years: [2010, 2011, 2013, 2016, 2017, 2018],
        type: 'professional',
      },
      {
        years: [...range(2004, 2016)],
        type: 'personal',
      },
    ],
  },
  {
    name: 'MongoDB',
    url: 'https://www.mongodb.com',
    logo: 'mongodb',
    logoColor: 'fill-tech-mongodb',
    usages: [
      {
        years: [...range(2013, 2016)],
        type: 'professional',
      },
    ],
  },
  {
    name: 'gRPC',
    url: 'https://grpc.io',
    logo: 'grpc',
    logoColor: 'fill-tech-grpc',
    usages: [
      {
        years: [...range(2016, 2020)],
        type: 'professional',
      },
    ],
  },
];

export const Skills = () => {
  const t = useTranslations('home.skills');

  const currentYear = new Date().getFullYear();
  const minYear = 2004;
  const [nameFilter, setNameFilter] = React.useState('');
  const [yearsBack, setYearsBack] = React.useState(4);
  const fromYear = currentYear - yearsBack;

  // Randomize skills order on each page visit (client-side only to avoid SSR mismatch)
  const [randomizedSkills, setRandomizedSkills] =
    React.useState<SkillData[]>(skillsData);

  React.useEffect(() => {
    setRandomizedSkills(shuffle(skillsData));
  }, []);

  // Filter skills based on name, and year range
  const filteredSkills = randomizedSkills.filter(skill => {
    // Filter by name
    const matchesName = skill.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    if (!matchesName) {
      return false;
    }

    // Filter by year range: show skills active within the last yearsBack years
    const hasYearInRange = skill.usages.some(usage =>
      usage.years.some(year => year > fromYear && year <= currentYear),
    );
    return hasYearInRange;
  });

  return (
    <>
      <Heading level={2}>{t('title')}</Heading>

      <div className="my-10">{t('description')}</div>

      {/* Filters */}
      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row">
        {/* Name filter */}
        <Input
          type="text"
          aria-label={t('form.nameFilter')}
          placeholder={t('form.nameFilter')}
          variant="bordered"
          className="md:w-64"
          isClearable
          value={nameFilter}
          onValueChange={setNameFilter}
          onClear={() => {
            setNameFilter('');
          }}
        />

        {/* Year from filter */}
        <Slider
          label={t('form.yearFilter')}
          aria-label={t('form.yearFilter')}
          showSteps
          color="warning"
          size="sm"
          step={1}
          minValue={1}
          maxValue={currentYear - minYear + 1}
          value={yearsBack}
          onChange={value => {
            setYearsBack(Array.isArray(value) ? value[0] : value);
          }}
          className="max-w-md"
          formatOptions={{ useGrouping: false }}
          renderValue={() => (
            <div className="text-small">
              {t('form.yearFilterCount', { count: yearsBack })}
            </div>
          )}
        />
      </div>

      {/* Skills Grid */}
      <MotionConfig reducedMotion="user">
        <div className="grid grid-cols-2 gap-4 px-5 md:grid-cols-4 lg:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map(skill => (
              <motion.a
                key={skill.name}
                layout
                href={skill.url || '#'}
                className="group flex w-full flex-col items-center justify-center border-none pt-4 md:pt-8"
                data-chromatic="ignore"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  duration: 0.15,
                  layout: { type: 'spring', stiffness: 280, damping: 30 },
                }}
              >
                <Logo
                  className={`${skill.logoColor ?? 'dark:fill-foreground fill-neutral-700'} cls-boop-animation h-16 w-16 transition-transform group-hover:scale-125`}
                  name={skill.logo}
                />
                <span className="mt-2 text-center text-sm">{skill.name}</span>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </MotionConfig>
      {/* No results message */}
      {filteredSkills.length === 0 && (
        <p className="text-center text-neutral-500">{t('noSkillsFound')}</p>
      )}
    </>
  );
};
