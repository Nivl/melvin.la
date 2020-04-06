'use strict';

var React = require("react");
var AngleRightIcon$MelvinLa = require("../svg/AngleRightIcon.bs.js");

((require('./About.scss')));

function About(Props) {
  var title = Props.title;
  var content = Props.content;
  var resumeUrl = Props.resumeUrl;
  var pictureUrl = Props.pictureUrl;
  return React.createElement("div", {
              id: "about"
            }, React.createElement("div", {
                  className: "about-content"
                }, React.createElement("h2", undefined, title), React.createElement("p", undefined, content), React.createElement("a", {
                      className: "resume",
                      href: resumeUrl
                    }, React.createElement("div", {
                          className: "simplified-svg-logo"
                        }, React.createElement(AngleRightIcon$MelvinLa.make, { })), "Download my Resume")), React.createElement("div", {
                  className: "picture"
                }, React.createElement("img", {
                      alt: "me",
                      src: pictureUrl
                    })));
}

var make = About;

exports.make = make;
/*  Not a pure module */
