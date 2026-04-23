import { Button } from "@heroui/react";
import { Menu as MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const MobileDrawerLoading = () => {
  const t = useTranslations("navbar");
  return (
    <Button className="p-0 md:hidden" variant="ghost" aria-label={t("openMenu")}>
      <MenuIcon className="h-5 w-5" />
    </Button>
  );
};
