export type Result = {
  sections: Sections;
};

export type Sections = {
  about: About;
  contact: Contact;
  backendOps: Tech;
  clientTech: Tech;
};

export type About = {
  title: string;
  content: string;
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
