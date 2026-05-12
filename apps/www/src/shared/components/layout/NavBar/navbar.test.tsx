import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { Navbar } from "./navbar";

vi.mock(import("motion/react"), async () => {
  const { motionMock } = await import("#shared/utils/mocks/motion");
  return motionMock as unknown as Awaited<typeof import("motion/react")>;
});

vi.mock(import("next/dynamic"), async () => {
  const { dynamicMock } = await import("#shared/utils/mocks/dynamic");
  return dynamicMock as unknown as Awaited<typeof import("next/dynamic")>;
});

let mockPathname = "/";

vi.mock(import("#i18n/routing"), async (importOriginal) => {
  const actual = await importOriginal<typeof import("#i18n/routing")>();
  return {
    ...actual,
    usePathname: () => mockPathname,
  };
});

const setup = (pathname = "/") => {
  mockPathname = pathname;
  return render(<Navbar />, { wrapper });
};

describe("navbar", () => {
  it("renders without crashing", () => {
    expect.assertions(1);
    expect(() => setup()).not.toThrow();
  }, 5000);

  it("renders all nav items", () => {
    expect.assertions(4);
    setup();
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Blog" })).toBeDefined();
    expect(screen.getByRole("button", { name: /Games/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Tools/i })).toBeDefined();
  }, 5000);

  it("shows nav indicator on home route", () => {
    expect.assertions(1);
    setup("/");
    // The motion.span with layoutId="nav-indicator" renders as a plain span
    // We verify it appears only once (for the active home item)
    // At least one indicator span exists when on home route
    const activeLink = screen.getByRole("link", { name: "Home" });
    expect(activeLink.closest("span")?.querySelector("span")).not.toBeNull();
  }, 5000);

  it("shows nav indicator on blog route", () => {
    expect.assertions(1);
    setup("/blog");
    const activeLink = screen.getByRole("link", { name: "Blog" });
    expect(activeLink.closest("span")?.querySelector("span")).not.toBeNull();
  }, 5000);

  it("shows nav indicator on games route", () => {
    expect.assertions(1);
    setup("/games/conway");
    const gamesButton = screen.getByRole("button", { name: /Games/i });
    expect(gamesButton.closest("span")?.querySelector("span")).not.toBeNull();
  }, 5000);

  it("shows nav indicator on tools route", () => {
    expect.assertions(1);
    setup("/tools/uuid");
    const toolsButton = screen.getByRole("button", { name: /Tools/i });
    expect(toolsButton.closest("span")?.querySelector("span")).not.toBeNull();
  }, 5000);

  it("games indicator absent on non-games route", () => {
    expect.assertions(1);
    setup("/");
    const gamesButton = screen.getByRole("button", { name: /Games/i });
    expect(gamesButton.closest("span")?.querySelector("span")).toBeNull();
  }, 5000);

  it("tools indicator absent on non-tools route", () => {
    expect.assertions(1);
    setup("/");
    const toolsButton = screen.getByRole("button", { name: /Tools/i });
    expect(toolsButton.closest("span")?.querySelector("span")).toBeNull();
  }, 5000);

  it("home link is active on / route", () => {
    expect.assertions(2);
    setup("/");
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeDefined();
    // Blog link should not have an indicator span sibling
    const blogLink = screen.getByRole("link", { name: "Blog" });
    expect(blogLink.closest("span")?.querySelector("span")).toBeNull();
  }, 5000);

  it("blog link is active on /blog route", () => {
    expect.assertions(2);
    setup("/blog");
    const blogLink = screen.getByRole("link", { name: "Blog" });
    expect(blogLink).toBeDefined();
    // Home link should not have an indicator span sibling
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.closest("span")?.querySelector("span")).toBeNull();
  }, 5000);

  it("games button has bold style on /games route", () => {
    expect.assertions(1);
    setup("/games/conway");
    const gamesButton = screen.getByRole("button", { name: /Games/i });
    expect(gamesButton.className).toContain("font-semibold");
  }, 5000);

  it("games button does not have bold style on non-games route", () => {
    expect.assertions(1);
    setup("/");
    const gamesButton = screen.getByRole("button", { name: /Games/i });
    expect(gamesButton.className).not.toContain("font-semibold");
  }, 5000);

  it("tools button has bold style on /tools route", () => {
    expect.assertions(1);
    setup("/tools/uuid");
    const toolsButton = screen.getByRole("button", { name: /Tools/i });
    expect(toolsButton.className).toContain("font-semibold");
  }, 5000);

  it("tools button does not have bold style on non-tools route", () => {
    expect.assertions(1);
    setup("/");
    const toolsButton = screen.getByRole("button", { name: /Tools/i });
    expect(toolsButton.className).not.toContain("font-semibold");
  }, 5000);

  it("dropdown buttons use h-8 to fix button height", () => {
    expect.assertions(1);
    setup();
    const gamesButton = screen.getByRole("button", { name: /Games/i });
    expect(gamesButton.className).toContain("h-8");
  }, 5000);

  it("home link points to /", () => {
    expect.assertions(1);
    setup();
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.getAttribute("href")).toBe("/");
  }, 5000);

  it("blog link points to /blog", () => {
    expect.assertions(1);
    setup();
    const blogLink = screen.getByRole("link", { name: "Blog" });
    expect(blogLink.getAttribute("href")).toBe("/blog");
  }, 5000);

  it('hamburger toggle shows "Open menu" when menu is closed', async () => {
    expect.assertions(1);
    setup();
    await expect(screen.findByRole("button", { name: "Open menu" })).resolves.toBeDefined();
  }, 5000);

  it("hamburger toggle updates accessible name when clicked", async () => {
    expect.assertions(1);
    setup();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Open menu" }));
    await expect(screen.findByRole("button", { name: "Close menu" })).resolves.toBeDefined();
  }, 5000);

  it("clicking a mobile menu link closes the menu", async () => {
    expect.assertions(1);
    setup();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Open menu" }));
    // Scope to the mobile menu container to avoid ambiguity with desktop nav links
    const mobileMenu = await screen.findByTestId("navbar-mobile-menu");
    await user.click(within(mobileMenu).getByRole("link", { name: "Home" }));
    // Toggle should revert to "Open menu" label
    await expect(screen.findByRole("button", { name: "Open menu" })).resolves.toBeDefined();
  }, 5000);
});
