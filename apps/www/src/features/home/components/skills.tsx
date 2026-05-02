"use client";

import { CloseButton, Label, Slider } from "@heroui/react";
import { range as esRange, shuffle } from "es-toolkit";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useTranslations } from "next-intl";
import React from "react";

import { Heading } from "#shared/components/layout/heading";

import { Logo } from "./logo";

type UsageType = "professional" | "personal" | "openSource";

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

const range = (from: number, to: number | "now") => {
  const target = to === "now" ? new Date().getFullYear() : to;
  return esRange(from, target + 1);
};

const skillsData: SkillData[] = [
  {
    logo: "php",
    logoColor: "fill-tech-php",
    name: "PHP",
    url: "https://www.php.net",
    usages: [
      {
        type: "professional",
        years: [2011, 2013],
      },
      {
        type: "personal",
        years: [...range(2004, 2010)],
      },
      {
        type: "openSource",
        years: [...range(2004, 2010)],
      },
    ],
  },
  {
    logo: "emacslisp",
    name: "Emacs Lisp",
    url: "https://en.wikipedia.org/wiki/Emacs_Lisp",
    usages: [
      {
        type: "personal",
        years: [...range(2010, 2013)],
      },
      {
        type: "openSource",
        years: [2011],
      },
    ],
  },
  {
    logo: "python",
    name: "python",
    url: "https://www.python.org/",
    usages: [
      {
        type: "professional",
        years: [...range(2011, 2014)],
      },
      {
        type: "personal",
        years: [...range(2010, 2014)],
      },
      {
        type: "openSource",
        years: [2012, 2013],
      },
    ],
  },
  {
    logo: "django",
    logoColor: "fill-tech-django dark:fill-foreground",
    name: "Django",
    url: "https://www.djangoproject.com/",
    usages: [
      {
        type: "professional",
        years: [2011, 2013, 2014],
      },
      {
        type: "personal",
        years: [...range(2005, 2013)],
      },
      {
        type: "openSource",
        years: [2012, 2013],
      },
    ],
  },
  {
    logo: "java",
    name: "java",
    url: "https://www.java.com/",
    usages: [
      {
        type: "professional",
        years: [...range(2014, 2016)],
      },
      {
        type: "personal",
        years: [2013, 2014],
      },
      {
        type: "openSource",
        years: [2015],
      },
    ],
  },
  {
    logo: "ionic",
    logoColor: "fill-tech-ionic",
    name: "Ionic",
    url: "https://ionicframework.com",
    usages: [
      {
        type: "professional",
        years: [...range(2014, 2015)],
      },
      {
        type: "openSource",
        years: [2014],
      },
    ],
  },
  {
    logo: "javascript",
    logoColor: "fill-tech-javascript",
    name: "Javascript",
    url: "https://en.wikipedia.org/wiki/JavaScript",
    usages: [
      {
        type: "professional",
        years: [...range(2013, "now")],
      },
      {
        type: "personal",
        years: [...range(2005, "now")],
      },
      {
        type: "openSource",
        years: [2014, 2023],
      },
    ],
  },
  {
    logo: "android",
    logoColor: "fill-tech-android",
    name: "Android",
    url: "https://developer.android.com/",
    usages: [
      {
        type: "professional",
        years: [...range(2014, 2016)],
      },
      {
        type: "openSource",
        years: [2015],
      },
    ],
  },
  {
    logo: "go",
    logoColor: "fill-tech-go",
    name: "Go",
    url: "https://golang.org",
    usages: [
      {
        type: "professional",
        years: [...range(2016, 2025)],
      },
      {
        type: "personal",
        years: [...range(2015, "now")],
      },
      {
        type: "openSource",
        years: [2016, 2018, 2019, 2020, 2021, 2024, 2025],
      },
    ],
  },
  {
    logo: "typescript",
    logoColor: "fill-tech-typescript",
    name: "Typescript",
    url: "https://www.typescriptlang.org",
    usages: [
      {
        type: "professional",
        years: [...range(2016, "now")],
      },
      {
        type: "personal",
        years: [...range(2016, "now")],
      },
      {
        type: "openSource",
        years: [2012],
      },
    ],
  },
  {
    logo: "reactjs",
    logoColor: "fill-tech-react",
    name: "ReactJS",
    url: "https://reactjs.org",
    usages: [
      {
        type: "professional",
        years: [...range(2018, "now")],
      },
      {
        type: "personal",
        years: [...range(2017, "now")],
      },
    ],
  },
  {
    logo: "nodejs",
    logoColor: "fill-tech-node",
    name: "NodeJS",
    url: "https://nodejs.org",
    usages: [
      {
        type: "professional",
        years: [...range(2013, "now")],
      },
      {
        type: "personal",
        years: [...range(2013, "now")],
      },
    ],
  },
  {
    logo: "c",
    name: "c",
    url: "https://en.wikipedia.org/wiki/C_(programming_language)",
    usages: [
      {
        type: "personal",
        years: [...range(2005, 2013)],
      },
    ],
  },
  {
    logo: "objc",
    name: "Objective-C",
    url: "https://en.wikipedia.org/wiki/Objective-C",
    usages: [
      {
        type: "professional",
        years: [2018, 2019, 2020],
      },
    ],
  },
  {
    logo: "amplitude",
    logoColor: "fill-tech-amplitude",
    name: "amplitude",
    url: "https://amplitude.com",
    usages: [
      {
        type: "professional",
        years: [...range(2018, "now")],
      },
    ],
  },
  {
    logo: "cpp",
    name: "C++",
    url: "https://en.wikipedia.org/wiki/C%2B%2B",
    usages: [
      {
        type: "personal",
        years: [...range(2005, 2013)],
      },
    ],
  },
  {
    logo: "csharp",
    name: "C#",
    url: "https://en.wikipedia.org/wiki/C_Sharp_(programming_language)",
    usages: [
      {
        type: "professional",
        years: [2016, 2017, 2018],
      },
    ],
  },
  {
    logo: "swift",
    name: "swift",
    url: "https://developer.apple.com/swift",
    usages: [
      {
        type: "professional",
        years: [...range(2014, 2016)],
      },
    ],
  },
  {
    logo: "apple",
    name: "iOS",
    url: "https://developer.apple.com/ios/",
    usages: [
      {
        type: "professional",
        years: [...range(2014, 2016)],
      },
    ],
  },
  {
    logo: "redis",
    logoColor: "fill-tech-redis",
    name: "Redis",
    url: "https://redis.io",
    usages: [
      {
        type: "professional",
        years: [...range(2016, "now")],
      },
    ],
  },
  {
    logo: "ruby",
    logoColor: "fill-tech-ruby",
    name: "Ruby",
    url: "https://www.ruby-lang.org",
    usages: [
      {
        type: "personal",
        years: [...range(2018, 2020)],
      },
    ],
  },
  {
    logo: "rails",
    logoColor: "fill-tech-rails",
    name: "Rails",
    url: "https://rubyonrails.org/",
    usages: [
      {
        type: "personal",
        years: [...range(2018, 2020)],
      },
    ],
  },
  {
    logo: "clojure",
    name: "clojure",
    url: "https://clojure.org",
    usages: [
      {
        type: "professional",
        years: [2021, 2022, 2023],
      },
      {
        type: "openSource",
        years: [2026],
      },
    ],
  },
  {
    logo: "sentry",
    logoColor: "fill-tech-sentry-light dark:fill-foreground",
    name: "Sentry",
    url: "https://sentry.io",
    usages: [
      {
        type: "professional",
        years: [2018, 2019, 2020],
      },
      {
        type: "personal",
        years: [2016, 2017, 2018, 2026],
      },
    ],
  },
  {
    logo: "openai",
    name: "OpenAI",
    url: "https://openai.com/api",
    usages: [
      {
        type: "professional",
        years: [2025, 2026],
      },
    ],
  },
  {
    logo: "elevenlabs",
    name: "ElevenLabs",
    url: "https://elevenlabs.io/",
    usages: [
      {
        type: "professional",
        years: [2025, 2026],
      },
    ],
  },
  {
    logo: "angular",
    logoColor: "fill-tech-angular",
    name: "Angular",
    url: "https://angular.dev",
    usages: [
      {
        type: "professional",
        years: [...range(2014, 2018)],
      },
      {
        type: "personal",
        years: [2013, 2014],
      },
    ],
  },
  {
    logo: "symfony",
    name: "Symfony",
    url: "https://symfony.com",
    usages: [
      {
        type: "professional",
        years: [2013],
      },
    ],
  },
  {
    logo: "newrelic",
    name: "New Relic",
    url: "https://newrelic.com",
    usages: [
      {
        type: "professional",
        years: [...range(2016, 2018)],
      },
    ],
  },
  {
    logo: "electron",
    name: "electron",
    url: "https://electronjs.org",
    usages: [
      {
        type: "professional",
        years: [...range(2016, 2020)],
      },
    ],
  },
  {
    logo: "datadog",
    logoColor: "fill-tech-datadog dark:fill-foreground",
    name: "Datadog",
    url: "https://datadoghq.com",
    usages: [
      {
        type: "professional",
        years: [...range(2018, "now")],
      },
    ],
  },
  {
    logo: "docker",
    logoColor: "fill-tech-docker",
    name: "Docker",
    url: "https://www.docker.com",
    usages: [
      {
        type: "professional",
        years: [...range(2016, "now")],
      },
      {
        type: "personal",
        years: [...range(2016, "now")],
      },
    ],
  },
  {
    logo: "postgres",
    logoColor: "fill-tech-postgres",
    name: "PostgreSQL",
    url: "https://www.postgresql.org",
    usages: [
      {
        type: "professional",
        years: [...range(2018, "now")],
      },
      {
        type: "personal",
        years: [...range(2016, "now")],
      },
    ],
  },
  {
    logo: "mysql",
    logoColor: "fill-tech-mysql",
    name: "MySQL",
    url: "https://www.mysql.com",
    usages: [
      {
        type: "professional",
        years: [2010, 2011, 2013, 2016, 2017, 2018],
      },
      {
        type: "personal",
        years: [...range(2004, 2016)],
      },
    ],
  },
  {
    logo: "mongodb",
    logoColor: "fill-tech-mongodb",
    name: "MongoDB",
    url: "https://www.mongodb.com",
    usages: [
      {
        type: "professional",
        years: [...range(2013, 2016)],
      },
    ],
  },
  {
    logo: "grpc",
    logoColor: "fill-tech-grpc",
    name: "gRPC",
    url: "https://grpc.io",
    usages: [
      {
        type: "professional",
        years: [...range(2016, 2020)],
      },
    ],
  },
];

export const Skills = () => {
  const t = useTranslations("home.skills");

  const currentYear = new Date().getFullYear();
  const minYear = 2004;
  const [nameFilter, setNameFilter] = React.useState("");
  const [yearsBack, setYearsBack] = React.useState(4);
  const fromYear = currentYear - yearsBack;

  // Randomize skills order on each page visit (client-side only to avoid SSR mismatch)
  const [randomizedSkills, setRandomizedSkills] = React.useState(skillsData);

  React.useEffect(() => {
    setRandomizedSkills(shuffle(skillsData));
  }, []);

  // Filter skills based on name, and year range
  const filteredSkills = randomizedSkills.filter((skill) => {
    // Filter by name
    const matchesName = skill.name.toLowerCase().includes(nameFilter.toLowerCase());
    if (!matchesName) {
      return false;
    }

    // Filter by year range: show skills active within the last yearsBack years
    const hasYearInRange = skill.usages.some((usage) =>
      usage.years.some((year) => year > fromYear && year <= currentYear),
    );
    return hasYearInRange;
  });

  return (
    <>
      <Heading level={2}>{t("title")}</Heading>

      <div className="my-10">{t("description")}</div>

      {/* Filters */}
      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row">
        {/* Name filter */}
        <div className="relative md:w-64">
          <input
            type="text"
            aria-label={t("form.nameFilter")}
            placeholder={t("form.nameFilter")}
            className="input input-secondary md:h-12 md:w-64"
            value={nameFilter}
            onChange={(event) => {
              setNameFilter(event.target.value);
            }}
          />
          {nameFilter && (
            <CloseButton
              aria-label={t("form.clearInput")}
              className="absolute inset-y-3 right-2 flex items-center"
              onPress={() => {
                setNameFilter("");
              }}
            />
          )}
        </div>

        {/* Year from filter */}
        <Slider
          className="mb-10 w-full max-w-md md:mb-0"
          step={1}
          minValue={1}
          maxValue={currentYear - minYear + 1}
          value={yearsBack}
          onChange={(value) => {
            const next = Array.isArray(value) ? value[0] : value;
            setYearsBack(typeof next === "number" ? next : yearsBack);
          }}
        >
          <Label>{t("form.yearFilter")}</Label>
          <Slider.Output>
            {({ state }) => t("form.yearFilterCount", { count: state.values[0] })}
          </Slider.Output>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      </div>

      {/* Skills Grid */}
      <MotionConfig reducedMotion="user">
        <div className="grid grid-cols-2 gap-4 px-5 md:grid-cols-4 lg:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.a
                key={skill.name}
                layout
                href={skill.url || "#"}
                className="group flex w-full flex-col items-center justify-center border-none pt-4 md:pt-8"
                data-chromatic="ignore"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  duration: 0.15,
                  layout: { damping: 30, stiffness: 280, type: "spring" },
                }}
              >
                <Logo
                  className={`${skill.logoColor ?? "fill-neutral-700 dark:fill-foreground"} cls-boop-animation h-16 w-16 transition-transform group-hover:scale-125`}
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
        <p className="text-center text-neutral-500">{t("noSkillsFound")}</p>
      )}
    </>
  );
};
