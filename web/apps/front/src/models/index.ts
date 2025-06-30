export type Result = {
  pages: Pages;
};

export type Pages = {
  about: About;
  contact: Contact;
  backendOps: Tech;
  clientTech: Tech;
};

export type About = {
  title: string;
  content: string;
  resumeUrl: string;
  linkedInUrl: string;
  pictureUrl: string;
  cta: CTA;
};

export type Logo = {
  img: string;
  name: string;
  url: string;
};

export type Contact = {
  email: string;
  linkedInHandle?: string | null;
  githubHandle: string;
};

export type CTA = {
  text: string;
  url: string;
};

export type Tech = {
  title: string;
  content: string[];
  logos: Logo[];
};
