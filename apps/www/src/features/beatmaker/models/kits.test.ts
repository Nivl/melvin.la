import { describe, expect, it } from "vitest";

import { getSampleUrl, KITS } from "./kits";

describe("kits", () => {
  it("contains exactly 808, acoustic, and lofi kits", () => {
    expect.assertions(1);
    expect(Object.keys(KITS)).toStrictEqual(["808", "acoustic", "lofi"]);
  }, 5000);

  it(
    getSampleUrl,
    () => {
      expect.assertions(2);
      expect(getSampleUrl("808", "kick")).toBe("/assets/games/beatmaker/samples/v2/808/kick.mp3");
      expect(getSampleUrl("lofi", "ride")).toBe("/assets/games/beatmaker/samples/v2/lofi/ride.mp3");
    },
    5000,
  );
});
