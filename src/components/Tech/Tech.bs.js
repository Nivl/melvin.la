'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var React = require("react");
var Logo$MelvinLa = require("../svg/Logo.bs.js");

((require('./Tech.scss')));

function Tech(Props) {
  var title = Props.title;
  var content = Props.content;
  var logos = Props.logos;
  return React.createElement("div", {
              className: "tech"
            }, React.createElement("div", {
                  className: "logos"
                }, $$Array.of_list(List.map((function (logo) {
                            return React.createElement("a", {
                                        key: logo[/* name */2],
                                        className: "tech-logo simplified-svg-logo",
                                        href: logo[/* url */1]
                                      }, React.createElement(Logo$MelvinLa.make, {
                                            name: logo[/* img */0]
                                          }));
                          }), logos))), React.createElement("div", {
                  className: "tech-content"
                }, React.createElement("h2", undefined, title), $$Array.of_list(List.map((function (c) {
                            return React.createElement("p", undefined, c);
                          }), content))));
}

var make = Tech;

exports.make = make;
/*  Not a pure module */
