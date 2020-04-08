module Android = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Android";
};

module Angular = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Angular";
};

module Apple = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Apple";
};

module Aws = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Aws";
};

module C = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "C";
};

module Cpp = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Cpp";
};

module Django = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Django";
};

module Docker = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Docker";
};

module ElasticSearch = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "ElasticSearch";
};

module Electron = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Electron";
};

module Go = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Go";
};

module GoogleCloud = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "GoogleCloud";
};

module Grpc = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Grpc";
};

module Heroku = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Heroku";
};

module Java = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Java";
};

module Javascript = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Javascript";
};

module Melvin = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Melvin";
};

module Mongodb = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Mongodb";
};

module Mysql = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Mysql";
};

module Nodejs = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Nodejs";
};

module Postgres = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Postgres";
};

module Python = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Python";
};

module Reactjs = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "React";
};

module Reasonml = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Reasonml";
};

module Redis = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Redis";
};

module Swift = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Swift";
};

module Typescript = {
  [@bs.module "./logo.js"] [@react.component]
  external make: (~title: string=?) => React.element = "Typescript";
};

[@react.component]
let make = (~name: string) =>
  switch (name) {
  | "android" => <Android />
  | "angular" => <Angular />
  | "apple" => <Apple />
  | "aws" => <Aws />
  | "c" => <C />
  | "cpp" => <Cpp />
  | "django" => <Django />
  | "docker" => <Docker />
  | "elasticSearch" => <ElasticSearch />
  | "electron" => <Electron />
  | "go" => <Go />
  | "googleCloud" => <GoogleCloud />
  | "grpc" => <Grpc />
  | "heroku" => <Heroku />
  | "java" => <Java />
  | "javascript" => <Javascript />
  | "mongodb" => <Mongodb />
  | "mysql" => <Mysql />
  | "nodejs" => <Nodejs />
  | "postgres" => <Postgres />
  | "python" => <Python />
  | "reactjs" => <Reactjs />
  | "reasonml" => <Reasonml />
  | "redis" => <Redis />
  | "swift" => <Swift />
  | "typescript" => <Typescript />
  // | _ => <Melvin />
  };