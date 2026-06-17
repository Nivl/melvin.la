import { captureException } from "@sentry/nextjs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { LanguageSwitcher } from "./language-switcher";

vi.mock(import("motion/react"), async () => {
  const { motionMock } = await import("#shared/utils/mocks/motion");
  return motionMock as unknown as Awaited<typeof import("motion/react")>;
});

// Partial mock: the providers in testWrapper rely on the real `logger`.
vi.mock(import("@sentry/nextjs"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    captureException: vi.fn<typeof actual.captureException>(),
  };
});

const mockPush = vi.fn<(href: { pathname: string }, options: { locale: string }) => void>();

vi.mock(import("#i18n/routing"), async (importOriginal) => {
  const actual = await importOriginal<typeof import("#i18n/routing")>();
  return {
    ...actual,
    usePathname: () => "/",
    useRouter: (() => ({ push: mockPush })) as unknown as typeof actual.useRouter,
  };
});

const pickLanguage = async (label: RegExp) => {
  await cookieStore.delete("NEXT_LOCALE");
  mockPush.mockClear();
  render(<LanguageSwitcher />, { wrapper });
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Change language" }));
  await user.click(await screen.findByRole("menuitemradio", { name: label }));
};

describe("languageSwitcher", () => {
  it("stores the chosen locale in the NEXT_LOCALE cookie", async () => {
    expect.assertions(2);
    await pickLanguage(/日本語/v);
    await expect(cookieStore.get("NEXT_LOCALE")).resolves.toMatchObject({ value: "ja" });
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/" }, { locale: "ja" });
  }, 5000);

  it("records an explicit default-locale choice", async () => {
    expect.assertions(1);
    // Without the cookie, the routing-layer detection would keep redirecting
    // users with a non-English browser away from the English pages.
    await pickLanguage(/English/v);
    await expect(cookieStore.get("NEXT_LOCALE")).resolves.toMatchObject({ value: "en" });
  }, 5000);

  it("still navigates and reports the error when the cookie write fails", async () => {
    expect.assertions(2);
    await cookieStore.delete("NEXT_LOCALE");
    mockPush.mockClear();
    const writeError = new Error("cookie write denied");
    const setSpy = vi.spyOn(cookieStore, "set").mockRejectedValueOnce(writeError);
    try {
      render(<LanguageSwitcher />, { wrapper });
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Change language" }));
      await user.click(await screen.findByRole("menuitemradio", { name: /日本語/v }));
    } finally {
      setSpy.mockRestore();
    }
    expect(captureException).toHaveBeenCalledWith(writeError);
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/" }, { locale: "ja" });
  }, 5000);

  it("still sets the cookie and navigates without the Cookie Store API", async () => {
    expect.assertions(2);
    await cookieStore.delete("NEXT_LOCALE");
    mockPush.mockClear();
    const original = cookieStore;
    // Simulate a browser without the Cookie Store API (Safari < 18.4).
    Reflect.deleteProperty(globalThis, "cookieStore");
    try {
      render(<LanguageSwitcher />, { wrapper });
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Change language" }));
      await user.click(await screen.findByRole("menuitemradio", { name: /Français/v }));
    } finally {
      Object.defineProperty(globalThis, "cookieStore", {
        configurable: true,
        value: original,
        writable: true,
      });
    }
    // The restored shim reads the same document.cookie jar the fallback wrote.
    await expect(cookieStore.get("NEXT_LOCALE")).resolves.toMatchObject({ value: "fr" });
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/" }, { locale: "fr" });
  }, 5000);
});
