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
        <NavbarItem isActive={pathname == '/fortnite'}>
          <Link color="foreground" href="/fortnite">
            Fortnite Data
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NuiNavbar>
  );
};
