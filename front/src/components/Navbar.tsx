'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar as NuiNavbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { CiPause1 as NothingIcon } from 'react-icons/ci';
import { FaChevronDown as DownIcon } from 'react-icons/fa';
import { GiConwayLifeGlider as ConwayIcon } from 'react-icons/gi';

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <NuiNavbar position="static">
      <NavbarContent>
        <NavbarItem isActive={pathname == '/'}>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>

        <NavbarItem isActive={pathname.startsWith('/fortnite')}>
          <Link color="foreground" href="/fortnite">
            Fortnite Data
          </Link>
        </NavbarItem>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className={`cursor-pointer bg-transparent p-0 text-medium text-foreground antialiased transition-opacity tap-highlight-transparent hover:opacity-80 active:opacity-disabled data-[hover=true]:bg-transparent ${pathname.startsWith('/conway') || pathname.startsWith('/nothing') ? 'font-semibold' : ''}`}
                radius="sm"
                variant="flat"
                endContent={<DownIcon />}
              >
                Games
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="games">
            <DropdownItem
              key="conway"
              description="Zero-player cellular automation game."
              startContent={<ConwayIcon className="h-5 w-5" />}
              href="/conway"
              className={`${pathname.startsWith('/conway') ? 'bg-neutral-100 dark:bg-[#222227]' : ''}`}
            >
              Game of Life
            </DropdownItem>
            <DropdownItem
              key="nothing"
              description="The game where you do nothing."
              startContent={<NothingIcon className="h-5 w-5" />}
              href="/nothing"
              className={`${pathname.startsWith('/nothing') ? 'bg-neutral-100 dark:bg-[#222227]' : ''}`}
            >
              Nothing
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </NuiNavbar>
  );
};
