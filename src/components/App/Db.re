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

type techLogo = {
  img: string,
  url: string,
  name: string,
};

type techPage = {
  title: string,
  content: list(string),
  logos: list(techLogo),
};

type pages = {
  about: pageAbout,
  contact: pageContact,
  backendOps: techPage,
  clientTech: techPage,
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

  let techLogo = json => {
    img: json |> field("img", string),
    url: json |> field("url", string),
    name: json |> field("name", string),
  };

  let techPage = json => {
    title: json |> field("title", string),
    content: json |> field("content", list(string)),
    logos: json |> field("logos", list(techLogo)),
  };

  let pages = json => {
    about: json |> field("about", pageAbout),
    contact: json |> field("contact", pageContact),
    backendOps: json |> field("backendOps", techPage),
    clientTech: json |> field("clientTech", techPage),
  };

  let db = json => {pages: json |> field("pages", pages)};
};