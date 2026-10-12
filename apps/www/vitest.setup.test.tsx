import { Button } from "@heroui/react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// react-aria calls requestAnimationFrame from a delayed timer
// (text-selection restore via runAfterTransition), which jsdom only provides
// when pretendToBeVisual is set. Without the fallback in vitest.setup.ts the
// timer callback throws an unhandled ReferenceError in whichever test file
// happens to be running when it fires.
describe("requestAnimationFrame fallback", () => {
  it("schedules the callback", async () => {
    expect.assertions(1);
    const callback = vi.fn<() => void>();
    requestAnimationFrame(() => {
      callback();
    });
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  }, 5000);

  it("cancels a scheduled callback", async () => {
    expect.assertions(1);
    const callback = vi.fn<() => void>();
    const handle = requestAnimationFrame(() => {
      callback();
    });
    cancelAnimationFrame(handle);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
    expect(callback).not.toHaveBeenCalled();
  }, 5000);

  it("survives react-aria's delayed text-selection restore on iOS", async () => {
    expect.assertions(1);
    // Forces react-aria's iOS branch: pressing schedules a setTimeout(300)
    // restore that calls runAfterTransition → requestAnimationFrame. The
    // timer fires after this test's interactions, so a missing rAF fails the
    // run as an unhandled error instead of a readable assertion.
    const { userAgent, platform, maxTouchPoints } = globalThis.navigator;
    Object.defineProperty(globalThis.navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    });
    Object.defineProperty(globalThis.navigator, "platform", {
      configurable: true,
      value: "iPhone",
    });
    Object.defineProperty(globalThis.navigator, "maxTouchPoints", {
      configurable: true,
      value: 5,
    });
    try {
      const user = userEvent.setup();
      render(<Button>Press</Button>);
      await user.click(screen.getByRole("button", { name: "Press" }));
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 400);
      });
      expect(screen.getByRole("button", { name: "Press" })).toBeDefined();
    } finally {
      Object.defineProperty(globalThis.navigator, "userAgent", {
        configurable: true,
        value: userAgent,
      });
      Object.defineProperty(globalThis.navigator, "platform", {
        configurable: true,
        value: platform,
      });
      Object.defineProperty(globalThis.navigator, "maxTouchPoints", {
        configurable: true,
        value: maxTouchPoints,
      });
    }
  }, 10_000);
});
