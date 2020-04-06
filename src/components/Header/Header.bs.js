'use strict';

var React = require("react");
var MelvinLogo$MelvinLa = require("../svg/MelvinLogo.bs.js");

((require('./Header.scss')));

function Header(Props) {
  return React.createElement("header", undefined, React.createElement("h1", undefined, React.createElement("span", {
                      className: "simplified-svg-logo"
                    }, React.createElement(MelvinLogo$MelvinLa.make, { })), React.createElement("div", {
                      className: "title-text"
                    }, React.createElement("span", {
                          className: "text-accent"
                        }, "MELVIN "), React.createElement("span", undefined, "LAPLANCHE"))), React.createElement("div", {
                  className: "subtitle"
                }, "FULL STACK ENGINEER BUILDING COOL STUFF AT ", React.createElement("a", {
                      href: "www.abstract.com"
                    }, "ABSTRACT")));
}

var make = Header;

exports.make = make;
/*  Not a pure module */
