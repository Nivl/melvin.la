import { Android } from './icons/Android';
import { Angular } from './icons/Angular';
import { Apple } from './icons/Apple';
import { Aws } from './icons/Aws';
import { C } from './icons/C';
import { Cpp } from './icons/Cpp';
import { Django } from './icons/Django';
import { Docker } from './icons/Docker';
import { ElasticSearch } from './icons/ElasticSearch';
import { Electron } from './icons/Electron';
import { Git } from './icons/Git';
import { Go } from './icons/Go';
import { GoogleCloud } from './icons/GoogleCloud';
import { Grpc } from './icons/Grpc';
import { Heroku } from './icons/Heroku';
import { Java } from './icons/Java';
import { Javascript } from './icons/Javascript';
import { MongoDb } from './icons/MongoDb';
import { Mysql } from './icons/Mysql';
import { Nodejs } from './icons/Nodejs';
import { Postgres } from './icons/Postgres';
import { Python } from './icons/Python';
import { Reactjs } from './icons/Reactjs';
import { ReasonMl } from './icons/ReasonMl';
import { Redis } from './icons/Redis';
import { Swift } from './icons/Swift';
import { Typescript } from './icons/Typescript';
import { Unknown } from './icons/Unknown';

export {
  Android,
  Angular,
  Apple,
  Aws,
  C,
  Cpp,
  Django,
  Docker,
  ElasticSearch,
  Electron,
  Git,
  Go,
  GoogleCloud,
  Grpc,
  Heroku,
  Java,
  Javascript,
  MongoDb,
  Mysql,
  Nodejs,
  Postgres,
  Python,
  Reactjs,
  ReasonMl,
  Redis,
  Swift,
  Typescript,
  Unknown,
};

export const Logo = ({
  name,
  className,
}: {
  name: string;
  className: string;
}) => {
  switch (name) {
    case 'android':
      return <Android className={className} />;
    case 'angular':
      return <Angular className={className} />;
    case 'apple':
      return <Apple className={className} />;
    case 'aws':
      return <Aws className={className} />;
    case 'c':
      return <C className={className} />;
    case 'cpp':
      return <Cpp className={className} />;
    case 'django':
      return <Django className={className} />;
    case 'docker':
      return <Docker className={className} />;
    case 'elasticSearch':
      return <ElasticSearch className={className} />;
    case 'electron':
      return <Electron className={className} />;
    case 'git':
      return <Git className={className} />;
    case 'go':
      return <Go className={className} />;
    case 'googleCloud':
      return <GoogleCloud className={className} />;
    case 'grpc':
      return <Grpc className={className} />;
    case 'heroku':
      return <Heroku className={className} />;
    case 'java':
      return <Java className={className} />;
    case 'javascript':
      return <Javascript className={className} />;
    case 'mongodb':
      return <MongoDb className={className} />;
    case 'mysql':
      return <Mysql className={className} />;
    case 'nodejs':
      return <Nodejs className={className} />;
    case 'postgres':
      return <Postgres className={className} />;
    case 'python':
      return <Python className={className} />;
    case 'reactjs':
      return <Reactjs className={className} />;
    case 'reasonml':
      return <ReasonMl className={className} />;
    case 'redis':
      return <Redis className={className} />;
    case 'swift':
      return <Swift className={className} />;
    case 'typescript':
      return <Typescript className={className} />;
    default:
      return <Unknown className={className} />;
  }
};
