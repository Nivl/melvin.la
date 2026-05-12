export type Sections = {
  backendOps: Tech;
  clientTech: Tech;
};

export type Logo = {
  img: string;
  name: string;
  url: string;
};

type Tech = {
  logos: Logo[];
};
