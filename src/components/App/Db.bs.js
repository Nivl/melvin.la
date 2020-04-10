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

function techLogo(json) {
  return /* record */[
          /* img */Json_decode.field("img", Json_decode.string, json),
          /* url */Json_decode.field("url", Json_decode.string, json),
          /* name */Json_decode.field("name", Json_decode.string, json)
        ];
}

function techPage(json) {
  return /* record */[
          /* title */Json_decode.field("title", Json_decode.string, json),
          /* content */Json_decode.field("content", (function (param) {
                  return Json_decode.list(Json_decode.string, param);
                }), json),
          /* logos */Json_decode.field("logos", (function (param) {
                  return Json_decode.list(techLogo, param);
                }), json)
        ];
}

function pages(json) {
  return /* record */[
          /* about */Json_decode.field("about", pageAbout, json),
          /* contact */Json_decode.field("contact", pageContact, json),
          /* backendOps */Json_decode.field("backendOps", techPage, json),
          /* clientTech */Json_decode.field("clientTech", techPage, json)
        ];
}

function db(json) {
  return /* record */[/* pages */Json_decode.field("pages", pages, json)];
}

var Decode = {
  pageAbout: pageAbout,
  pageContact: pageContact,
  techLogo: techLogo,
  techPage: techPage,
  pages: pages,
  db: db
};

exports.Decode = Decode;
/* No side effect */
