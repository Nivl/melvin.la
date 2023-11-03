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
