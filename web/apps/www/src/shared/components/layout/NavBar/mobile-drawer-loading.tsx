import { Button } from "@heroui/react";
import { Menu as MenuIcon } from "lucide-react";

export const MobileDrawerLoading = () => (
  // Keep the loading placeholder out of the accessibility tree so test and
  // Storybook interactions wait for the real drawer trigger to mount.
  <span aria-hidden="true" className="inline-flex md:hidden" inert>
    <Button className="p-0" variant="ghost">
      <MenuIcon className="h-5 w-5" />
    </Button>
  </span>
);
