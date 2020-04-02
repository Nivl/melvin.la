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

var dbRaw = " {\n  \"pages\": {\n    \"about\": {\n      \"title\": \"About Me\",\n      \"content\": \"With about 8 years of professional experience and 15 years of personal experience (that's more than half of my life!), I have been playing with many different technologies. I love to learn new things, and I never take any of my knowledge for granted (everything is evolving too fast to assume we still know how to do a specific task after a couple of years). I have a passion for clean architecture and well-tested code. People assume 100% code coverage is a waste of time, to me it's a way to make sure your code is flexible and more future proof.\",\n      \"resumeUrl\": \"https://github.com/Nivl/resume/raw/master/cv-melvin-laplanche.pdf\"\n    },\n    \"contact\": {\n      \"email\": \"jobs@melvin.la\",\n      \"linkedInHandle\": \"melvinlaplanche\",\n      \"githubHandle\": \"Nivl\"\n    }\n  }\n} ";

var db = Db$MelvinLa.Decode.db(Json.parseOrRaise(dbRaw));

function App(Props) {
  return React.createElement(React.Fragment, undefined, React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Header$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(About$MelvinLa.make, {
                        title: db[/* pages */0][/* about */0][/* title */0],
                        content: db[/* pages */0][/* about */0][/* content */1],
                        resumeUrl: db[/* pages */0][/* about */0][/* resumeUrl */2]
                      })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Tech$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Tech$MelvinLa.make, { })
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
