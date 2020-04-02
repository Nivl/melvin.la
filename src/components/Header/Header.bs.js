'use strict';

var React = require("react");
var LogoPng = require("./logo.png");

var logo = LogoPng;

function Header(Props) {
  return React.createElement("header", undefined, React.createElement("img", {
                  alt: "logo",
                  src: logo
                }), React.createElement("h1", undefined, "MELVIN LAPLANCHE"), React.createElement("div", undefined, "FULL STACK ENGINEER BUILDING COOL STUFF AT ", React.createElement("a", {
                      href: "www.abstract.com"
                    }, "ABSTRACT")));
}

var make = Header;

exports.logo = logo;
exports.make = make;
/* logo Not a pure module */
