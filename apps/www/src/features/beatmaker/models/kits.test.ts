import { expect, test } from "vitest";

import { getSampleUrl, KITS } from "./kits";

test("KITS contains exactly 808, acoustic, and lofi", () => {
  expect(Object.keys(KITS)).toEqual(["808", "acoustic", "lofi"]);
}, 5000);

test("getSampleUrl returns versioned path with correct extension", () => {
  expect(getSampleUrl("808", "kick")).toBe("/assets/games/beatmaker/samples/v2/808/kick.mp3");
  expect(getSampleUrl("lofi", "ride")).toBe("/assets/games/beatmaker/samples/v2/lofi/ride.mp3");
}, 5000);
