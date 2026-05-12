import type { ReactNode } from "react";

type NavLink = {
  type: "link";
  key: string;
  labelKey: string;
  href: string;
  logo: ReactNode;
};

type NavGroup = {
  type: "group";
  key: string;
  labelKey: string;
  pathPrefix: string;
  items: {
    key: string;
    labelKey: string;
    logo: ReactNode;
  }[];
};

export type NavSection = NavLink | NavGroup;
