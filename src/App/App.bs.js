'use strict';

var React = require("react");
var LogoSvg = require("./logo.svg");
var Tech$MelvinLa = require("../Tech/Tech.bs.js");
var About$MelvinLa = require("../About/About.bs.js");
var Footer$MelvinLa = require("../Footer/Footer.bs.js");
var Header$MelvinLa = require("../Header/Header.bs.js");
var Contact$MelvinLa = require("../Contact/Contact.bs.js");
var Section$MelvinLa = require("../Section/Section.bs.js");

((require('./App.scss')));

var logo = LogoSvg;

function App(Props) {
  return React.createElement(React.Fragment, undefined, React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Header$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(About$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Tech$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Tech$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Contact$MelvinLa.make, { })
                }), React.createElement(Section$MelvinLa.make, {
                  children: React.createElement(Footer$MelvinLa.make, { })
                }));
}

var make = App;

exports.logo = logo;
exports.make = make;
/*  Not a pure module */
