'use strict';

var React = require("react");

((require('./About.scss')));

function About(Props) {
  var title = Props.title;
  var content = Props.content;
  var resumeUrl = Props.resumeUrl;
  return React.createElement("div", {
              className: "about"
            }, React.createElement("h2", undefined, title), React.createElement("p", undefined, content), React.createElement("a", undefined, resumeUrl));
}

var make = About;

exports.make = make;
/*  Not a pure module */
