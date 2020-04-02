'use strict';

var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");

function pageAbout(json) {
  return /* record */[
          /* title */Json_decode.field("title", Json_decode.string, json),
          /* content */Json_decode.field("content", Json_decode.string, json),
          /* resumeUrl */Json_decode.field("resumeUrl", Json_decode.string, json)
        ];
}

function pages(json) {
  return /* record */[/* about */Json_decode.field("about", pageAbout, json)];
}

function db(json) {
  return /* record */[/* pages */Json_decode.field("pages", pages, json)];
}

var Decode = {
  pageAbout: pageAbout,
  pages: pages,
  db: db
};

exports.Decode = Decode;
/* No side effect */
