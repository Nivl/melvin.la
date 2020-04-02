'use strict';

var React = require("react");

((require('./Contact.scss')));

function Contact(Props) {
  var email = Props.email;
  var linkedInHandle = Props.linkedInHandle;
  var githubHandle = Props.githubHandle;
  return React.createElement(React.Fragment, undefined, email, linkedInHandle, githubHandle);
}

var make = Contact;

exports.make = make;
/*  Not a pure module */
