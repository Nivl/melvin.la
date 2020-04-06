type pageAbout = {
  title: string,
  content: string,
  resumeUrl: string,
  pictureUrl: string,
};

type pageContact = {
  email: string,
  linkedInHandle: string,
  githubHandle: string,
};

type pages = {
  about: pageAbout,
  contact: pageContact,
};

type db = {pages};

module Decode = {
  open Json.Decode;

  let pageAbout = json => {
    title: json |> field("title", string),
    content: json |> field("content", string),
    resumeUrl: json |> field("resumeUrl", string),
    pictureUrl: json |> field("pictureUrl", string),
  };

  let pageContact = json => {
    email: json |> field("email", string),
    linkedInHandle: json |> field("linkedInHandle", string),
    githubHandle: json |> field("githubHandle", string),
  };

  let pages = json => {
    about: json |> field("about", pageAbout),
    contact: json |> field("contact", pageContact),
  };

  let db = json => {pages: json |> field("pages", pages)};
};