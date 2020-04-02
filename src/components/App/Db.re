type pageAbout = {
  title: string,
  content: string,
  resumeUrl: string,
};

type pages = {about: pageAbout};

type db = {pages};

module Decode = {
  open Json.Decode;

  let pageAbout = json => {
    title: json |> field("title", string),
    content: json |> field("content", string),
    resumeUrl: json |> field("resumeUrl", string),
  };

  let pages = json => {about: json |> field("about", pageAbout)};

  let db = json => {pages: json |> field("pages", pages)};
};