'use strict';

var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");

function pageAbout(json) {
  return /* record */[
          /* title */Json_decode.field("title", Json_decode.string, json),
          /* content */Json_decode.field("content", Json_decode.string, json),
          /* resumeUrl */Json_decode.field("resumeUrl", Json_decode.string, json),
          /* pictureUrl */Json_decode.field("pictureUrl", Json_decode.string, json)
        ];
}

function pageContact(json) {
  return /* record */[
          /* email */Json_decode.field("email", Json_decode.string, json),
          /* linkedInHandle */Json_decode.field("linkedInHandle", Json_decode.string, json),
          /* githubHandle */Json_decode.field("githubHandle", Json_decode.string, json)
        ];
}

function pages(json) {
  return /* record */[
          /* about */Json_decode.field("about", pageAbout, json),
          /* contact */Json_decode.field("contact", pageContact, json)
        ];
}

function db(json) {
  return /* record */[/* pages */Json_decode.field("pages", pages, json)];
}

var Decode = {
  pageAbout: pageAbout,
  pageContact: pageContact,
  pages: pages,
  db: db
};

exports.Decode = Decode;
/* No side effect */
