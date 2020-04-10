'use strict';

var Json = require("@glennsl/bs-json/src/Json.bs.js");
var React = require("react");
var Db$MelvinLa = require("./Db.bs.js");
var Tech$MelvinLa = require("../Tech/Tech.bs.js");
var About$MelvinLa = require("../About/About.bs.js");
var Footer$MelvinLa = require("../Footer/Footer.bs.js");
var Header$MelvinLa = require("../Header/Header.bs.js");
var Contact$MelvinLa = require("../Contact/Contact.bs.js");
var Section$MelvinLa = require("../Section/Section.bs.js");

((require('./App.scss')));

var dbRaw = " {\n  \"pages\": {\n    \"about\": {\n      \"title\": \"About Me\",\n      \"content\": \"With about 8 years of professional experience and 15 years of personal experience (that's more than half of my life!), I have been playing with many different technologies. I love to learn new things, and I never take any of my knowledge for granted (everything is evolving too fast to assume we still know how to do a specific task after a couple of years). I have a passion for clean architecture and well-tested code. People assume 100% code coverage is a waste of time, to me it's a way to make sure your code is flexible and more future proof.\",\n      \"resumeUrl\": \"https://github.com/Nivl/resume/raw/master/cv-melvin-laplanche.pdf\",\n      \"pictureUrl\": \"/images/melvin.jpg\"\n    },\n    \"contact\": {\n      \"email\": \"jobs@melvin.la\",\n      \"linkedInHandle\": \"melvinlaplanche\",\n      \"githubHandle\": \"Nivl\"\n    },\n    \"backendOps\": {\n      \"title\": \"Backend / Ops technologies\",\n      \"content\": [\n        \"Like many people, backend is the very first \\\"real\\\" thing I started learning (I don't count HTML/CSS since they are not programing language). I started with raw PHP back when it was still the hot tech to build websites, then jumped on the new trends: Rails, Django, Symfony 2, Node, Go, etc (the list on the left doesn't contain all the tech I used, but only the one I liked the most and/or used the most). I usually try to keep myself up to date with the evolution of the backend techs while trying to understand all the pros and cons before taking a decision of moving forward with them (instead of blindly following the trend).\"\n      ],\n      \"logos\": [\n        { \"img\":\"go\", \"name\":\"Go\", \"url\":\"https://golang.org\" },\n        { \"img\":\"grpc\", \"name\":\"gRPC\", \"url\":\"https://grpc.io\" },\n        { \"img\":\"nodejs\", \"name\":\"NodeJS\", \"url\":\"https://nodejs.org\" },\n        { \"img\":\"django\", \"name\":\"Django\", \"url\":\"https://djangoproject.com\" },\n        { \"img\":\"python\", \"name\":\"Python\", \"url\":\"https://python.org\" },\n        { \"img\":\"postgres\", \"name\":\"Postgres\", \"url\":\"https://postgresql.org\" },\n        { \"img\":\"mysql\", \"name\":\"MySQL\", \"url\":\"https://mysql.com\" },\n        { \"img\":\"mongodb\", \"name\":\"MongoDB\", \"url\":\"https://mongodb.com\" },\n        { \"img\":\"redis\", \"name\":\"Redis\", \"url\":\"https://redis.io\" },\n        { \"img\":\"elasticSearch\", \"name\":\"ElasticSearch\", \"url\":\"https://www.elastic.co/products/elasticsearch\" },\n        { \"img\":\"googleCloud\", \"name\":\"Google Cloud\", \"url\":\"https://cloud.google.com/products/#cloud-computing\" },\n        { \"img\":\"heroku\", \"name\":\"Heroku\", \"url\":\"https://heroku.com/\" },\n        { \"img\":\"aws\", \"name\":\"AWS\", \"url\":\"https://aws.amazon.com/\" },\n        { \"img\":\"docker\", \"name\":\"Docker\", \"url\":\"https://docker.com\" }\n      ]\n    },\n    \"clientTech\": {\n      \"title\": \"CLIENT (WEB, MOBILE, DESKTOP, etc.) TECHNOLOGIES\",\n      \"content\": [\n        \"Backend is fun, but nowadays a backend doesn't do much beside treating data and returning more data to the clients. So naturally, I got interested in learning the client side of the stack. I'm convinced that writing client code made me a better backend engineer as I know the pain and struggle of dealing with undocumented APIs, or badly implemented APIs that partially return the data you need (you know, those APIs made by backend engineers that know better than you what data you need).\",\n        \"I professionally touched a bit of everything: native mobile apps (iOS and Android), hybrid mobile apps, regular Electron apps, Electron apps with a Go backend to do all the heavy lifting (with some cgo to use native Windows and macOS libraries), SPAs using angular, etc.\"\n      ],\n      \"logos\": [\n        { \"img\":\"android\", \"name\":\"Android\", \"url\":\"https://android.com\" },\n        { \"img\":\"apple\", \"name\":\"MacOS / iOS\", \"url\":\"https://developer.apple.com\" },\n        { \"img\":\"electron\", \"name\":\"Electron\", \"url\":\"https://electronjs.org\" },\n        { \"img\":\"c\", \"name\":\"C\", \"url\":\"https://www.wikiwand.com/en/C_(programming_language)\" },\n        { \"img\":\"cpp\", \"name\":\"C++\", \"url\":\"https://www.wikiwand.com/en/C%2B%2B\" },\n        { \"img\":\"javascript\", \"name\":\"JavaScript\", \"url\":\"https://www.wikiwand.com/en/JavaScript\" },\n        { \"img\":\"typescript\", \"name\":\"Typescript\", \"url\":\"https://www.typescriptlang.org\" },\n        { \"img\":\"reasonml\", \"name\":\"Reasonml\", \"url\":\"https://reasonml.github.io\" },\n        { \"img\":\"angular\", \"name\":\"Angular\", \"url\":\"https://angular.io\" },\n        { \"img\":\"reactjs\", \"name\":\"ReactJS\", \"url\":\"https://reactjs.org\" },\n        { \"img\":\"java\", \"name\":\"Java\", \"url\":\"https://java.com\" },\n        { \"img\":\"swift\", \"name\":\"Swift\", \"url\":\"https://swift.org\" },\n        { \"img\":\"git\", \"name\":\"Git internal\", \"url\":\"https://git-scm.com/book/en/v2\" }\n      ]\n    }\n  }\n} ";

var db = Db$MelvinLa.Decode.db(Json.parseOrRaise(dbRaw));

function App(Props) {
  return React.createElement(React.Fragment, undefined, React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Header$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(About$MelvinLa.make, {
                        title: db[/* pages */0][/* about */0][/* title */0],
                        content: db[/* pages */0][/* about */0][/* content */1],
                        resumeUrl: db[/* pages */0][/* about */0][/* resumeUrl */2],
                        pictureUrl: db[/* pages */0][/* about */0][/* pictureUrl */3]
                      })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Tech$MelvinLa.make, {
                        title: db[/* pages */0][/* backendOps */2][/* title */0],
                        content: db[/* pages */0][/* backendOps */2][/* content */1],
                        logos: db[/* pages */0][/* backendOps */2][/* logos */2]
                      })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Tech$MelvinLa.make, {
                        title: db[/* pages */0][/* clientTech */3][/* title */0],
                        content: db[/* pages */0][/* clientTech */3][/* content */1],
                        logos: db[/* pages */0][/* clientTech */3][/* logos */2]
                      })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Contact$MelvinLa.make, {
                        email: db[/* pages */0][/* contact */1][/* email */0],
                        linkedInHandle: db[/* pages */0][/* contact */1][/* linkedInHandle */1],
                        githubHandle: db[/* pages */0][/* contact */1][/* githubHandle */2]
                      })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Footer$MelvinLa.make, { })
                }));
}

var make = App;

exports.dbRaw = dbRaw;
exports.db = db;
exports.make = make;
/*  Not a pure module */
