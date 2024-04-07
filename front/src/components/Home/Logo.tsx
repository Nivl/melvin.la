import {
  FaAndroid as Android,
  FaApple as Apple,
  FaAws as Aws,
  FaDocker as Docker,
  FaGitAlt as Git,
  FaGolang as Go,
  FaJava as Java,
  FaNodeJs as Nodejs,
  FaReact as React,
} from 'react-icons/fa6';
import {
  GrMysql as Mysql,
  GrStatusUnknown as Unknown,
  GrSwift as Swift,
} from 'react-icons/gr';
import {
  SiCplusplus as Cpp,
  SiDatadog as Datadog,
  SiElectron as Electron,
  SiGooglecloud as GoogleCloud,
  SiJavascript as Javascript,
  SiMongodb as MongoDb,
  SiPostgresql as Postgres,
  SiRedis as Redis,
  SiTypescript as Typescript,
} from 'react-icons/si';

import { C } from '../icons/C';
import { Grpc } from '../icons/Grpc';

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
    case 'apple':
      return <Apple className={className} />;
    case 'aws':
      return <Aws className={className} />;
    case 'c':
      return <C className={className} />;
    case 'cpp':
      return <Cpp className={className} />;
    case 'datadog':
      return <Datadog className={className} />;
    case 'docker':
      return <Docker className={className} />;
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
    case 'reactjs':
      return <React className={className} />;
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
