export type Result = {
  sections: Sections;
};

export type Sections = {
  backendOps: Tech;
  clientTech: Tech;
};

export type Logo = {
  img: string;
  name: string;
  url: string;
};

export type CTA = {
  text: string;
  url: string;
};

export type Tech = {
  logos: Logo[];
};
