export interface Result {
  pages: Pages;
}

export interface Pages {
  about: About;
  contact: Contact;
  backendOps: Tech;
  clientTech: Tech;
}

export interface About {
  title: string;
  content: string;
  resumeUrl: string;
  linkedInUrl: string;
  pictureUrl: string;
  cta: CTA;
}

export interface Logo {
  img: string;
  name: string;
  url: string;
}

export interface Contact {
  email: string;
  linkedInHandle?: string | null;
  githubHandle: string;
}

export interface CTA {
  text: string;
  url: string;
}

export interface Tech {
  title: string;
  content: string[];
  logos: Logo[];
}
