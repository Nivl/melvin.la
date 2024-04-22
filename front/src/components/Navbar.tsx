'use client';

import {
  Link,
  Navbar as NuiNavbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { usePathname } from 'next/navigation';

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
        <NavbarItem isActive={pathname.startsWith('/conway')}>
          <Link color="foreground" href="/conway">
            Game of Life
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NuiNavbar>
  );
};
