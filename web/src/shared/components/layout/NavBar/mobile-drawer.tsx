"use client";

import { Button, Drawer } from "@heroui/react";
import { Menu as MenuIcon } from "lucide-react";

import { Link as NextLink } from "#i18n/routing";

import type { NavSection } from "./nav-sections";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  sections: NavSection[];
  t: (key: string) => string;
};

const MobileDrawer = ({ isOpen, onClose, onOpenChange, sections, t }: Props) => (
  <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
    <Button className="p-0 md:hidden" variant="ghost" aria-label={t("openMenu")}>
      <MenuIcon className="h-5 w-5" />
    </Button>

    <Drawer.Backdrop variant="blur">
      <Drawer.Content placement="left">
        <Drawer.Dialog className="">
          <Drawer.CloseTrigger aria-label={t("closeMenu")} />
          <Drawer.Header>
            <Drawer.Heading>{t("menu")}</Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body>
            <nav className="flex flex-col gap-1" data-testid="navbar-mobile-menu">
              {sections.map((section) => {
                const label = t(section.labelKey);

                if (section.type === "link") {
                  return (
                    <NextLink
                      key={section.key}
                      href={section.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    >
                      {section.logo}
                      {label}
                    </NextLink>
                  );
                }

                return (
                  <div key={section.key}>
                    <div className="mt-5 mb-2 font-semibold uppercase">{label}</div>

                    <div className="flex flex-col gap-1">
                      {section.items.map((item) => (
                        <NextLink
                          key={item.key}
                          onClick={onClose}
                          href={`${section.pathPrefix}/${item.key}`}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                        >
                          {item.logo}
                          {t(item.labelKey)}
                        </NextLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  </Drawer>
);

export { MobileDrawer };
