import { DiDjango as Django, DiRuby as Ruby } from "react-icons/di";
import { GrMysql as Mysql, GrStatusUnknown as Unknown } from "react-icons/gr";
import {
  SiAndroid as Android,
  SiAngular as Angular,
  SiApple as Apple,
  SiDatadog as Datadog,
  SiDocker as Docker,
  SiElevenlabs as Elevenlabs,
  SiGo as Go,
  SiIonic as Ionic,
  SiJavascript as Javascript,
  SiMongodb as MongoDb,
  SiNodedotjs as Nodejs,
  SiOpenai as OpenAI,
  SiPhp as Php,
  SiPostgresql as Postgres,
  SiReact as React,
  SiRedis as Redis,
  SiRubyonrails as Rails,
  SiSentry as Sentry,
  SiSymfony as Symfony,
  SiTypescript as Typescript,
} from "react-icons/si";

import { Amplitude } from "#features/home/components/icons/amplitude";
import { C } from "#features/home/components/icons/c";
import { CSharp } from "#features/home/components/icons/c-sharp";
import { Clojure } from "#features/home/components/icons/clojure";
import { Cpp } from "#features/home/components/icons/cpp";
import { Electron } from "#features/home/components/icons/electron";
import { EmacsLisp } from "#features/home/components/icons/emacs-lisp";
import { Grpc } from "#features/home/components/icons/grpc";
import { Java } from "#features/home/components/icons/java";
import { NewRelic } from "#features/home/components/icons/new-relic";
import { ObjectiveC } from "#features/home/components/icons/objective-c";
import { Python } from "#features/home/components/icons/python";
import { Swift } from "#features/home/components/icons/swift";

export const Logo = ({ name, className }: { name: string; className: string }) => {
  // all the logos we support, ordered alphabetically by name
  switch (name) {
    case "amplitude": {
      return <Amplitude className={className} />;
    }
    case "android": {
      return <Android className={className} />;
    }
    case "angular": {
      return <Angular className={className} />;
    }
    case "apple": {
      return <Apple className={className} />;
    }
    case "c": {
      return <C className={className} />;
    }
    case "clojure": {
      return <Clojure className={className} />;
    }
    case "cpp": {
      return <Cpp className={className} />;
    }
    case "csharp": {
      return <CSharp className={className} />;
    }
    case "datadog": {
      return <Datadog className={className} />;
    }
    case "django": {
      return <Django className={className} />;
    }
    case "docker": {
      return <Docker className={className} />;
    }
    case "electron": {
      return <Electron className={className} />;
    }
    case "elevenlabs": {
      return <Elevenlabs className={className} />;
    }
    case "emacslisp": {
      return <EmacsLisp className={className} />;
    }
    case "go": {
      return <Go className={className} />;
    }
    case "grpc": {
      return <Grpc className={className} />;
    }
    case "ionic": {
      return <Ionic className={className} />;
    }
    case "java": {
      return <Java className={className} />;
    }
    case "javascript": {
      return <Javascript className={className} />;
    }
    case "mongodb": {
      return <MongoDb className={className} />;
    }
    case "mysql": {
      return <Mysql className={className} />;
    }
    case "nodejs": {
      return <Nodejs className={className} />;
    }
    case "newrelic": {
      return <NewRelic className={className} />;
    }
    case "objc": {
      return <ObjectiveC className={className} />;
    }
    case "openai": {
      return <OpenAI className={className} />;
    }
    case "php": {
      return <Php className={className} />;
    }
    case "postgres": {
      return <Postgres className={className} />;
    }
    case "python": {
      return <Python className={className} />;
    }
    case "rails": {
      return <Rails className={className} />;
    }
    case "reactjs": {
      return <React className={className} />;
    }
    case "redis": {
      return <Redis className={className} />;
    }
    case "ruby": {
      return <Ruby className={className} />;
    }
    case "sentry": {
      return <Sentry className={className} />;
    }
    case "swift": {
      return <Swift className={className} />;
    }
    case "symfony": {
      return <Symfony className={className} />;
    }
    case "typescript": {
      return <Typescript className={className} />;
    }
    default: {
      return <Unknown className={className} />;
    }
  }
};
