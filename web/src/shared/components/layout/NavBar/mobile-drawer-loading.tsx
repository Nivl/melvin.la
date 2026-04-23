import { Button } from "@heroui/react";
import { Menu as MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const MobileDrawerLoading = () => {
  const t = useTranslations("navbar");
  return (
    // aria-hidden: this is a visual placeholder only — it has no onPress and
    // cannot open the drawer. The real interactive button is inside MobileDrawer
    // which loads asynchronously.
    <Button aria-hidden className="p-0 md:hidden" variant="ghost" aria-label={t("openMenu")}>
      <MenuIcon className="h-5 w-5" />
    </Button>
  );
};
