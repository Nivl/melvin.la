'use strict';

var React = require("react");

((require('./Section.scss')));

function Section(Props) {
  var children = Props.children;
  return React.createElement("section", undefined, children);
}

var make = Section;

exports.make = make;
/*  Not a pure module */
