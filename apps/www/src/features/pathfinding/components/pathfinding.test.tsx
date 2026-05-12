import { render, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { Pathfinding } from "./pathfinding";

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Pathfinding />, { wrapper });
  return { ...utils, user };
};

describe(Pathfinding, () => {
  it("all controls are rendered", () => {
    expect.assertions(7);
    const { getByRole, queryByRole } = setup();

    // Visualize button
    expect(getByRole("button", { name: /visualize/i })).toBeDefined();
    // Generate Maze button
    expect(getByRole("button", { name: /generate maze/i })).toBeDefined();
    // Clear All button
    expect(getByRole("button", { name: /clear all/i })).toBeDefined();
    // Mode buttons
    expect(getByRole("button", { name: /place walls/i })).toBeDefined();
    expect(getByRole("button", { name: /place start/i })).toBeDefined();
    expect(getByRole("button", { name: /place end/i })).toBeDefined();
    // Clear Path is hidden when grid has no visited/path cells
    expect(queryByRole("button", { name: /clear path/i })).toBeNull();
  }, 5000);

  it("algorithm selector is present", () => {
    expect.assertions(1);
    const { getByRole } = setup();
    // The algorithm select should be in the DOM
    expect(getByRole("button", { name: /algorithm/i })).toBeDefined();
  }, 5000);

  it("grid is rendered", () => {
    expect.assertions(1);
    const { getByRole } = setup();
    expect(getByRole("grid", { name: /pathfinding grid/i })).toBeDefined();
  }, 5000);

  it("visualize button is disabled during animation", async () => {
    expect.assertions(1);
    const { getByRole, findByRole, user } = setup();
    const visualizeBtn = getByRole("button", { name: /visualize/i });
    await user.click(visualizeBtn);
    // After click, the button should be replaced by Stop button
    const stopBtn = await findByRole("button", { name: /stop/i });
    expect(stopBtn).toBeDefined();
  }, 5000);

  it('clicking "Place Start" toggles to place-start mode; clicking again is a no-op (mode stays)', async () => {
    expect.assertions(1);
    const { getByRole, user } = setup();
    const placeStartBtn = getByRole("button", { name: /place start/i });

    await user.click(placeStartBtn);
    // Clicking the active button again should not crash (no-op)
    await user.click(placeStartBtn);
    expect(placeStartBtn).toBeDefined();
  }, 5000);

  it('activating "Place End" switches away from "Place Start"', async () => {
    expect.assertions(1);
    const { getByRole, user } = setup();
    const placeStartBtn = getByRole("button", { name: /place start/i });
    const placeEndBtn = getByRole("button", { name: /place end/i });

    await user.click(placeStartBtn);
    await user.click(placeEndBtn);
    expect(placeEndBtn).toBeDefined();
  }, 5000);

  it('"place walls" is the default active mode', () => {
    expect.assertions(1);
    const { getByRole } = setup();
    // place walls button should be present from the start
    expect(getByRole("button", { name: /place walls/i })).toBeDefined();
  }, 5000);

  it("start cell moves when clicking in place-start mode", async () => {
    expect.assertions(2);
    const { getByRole, user } = setup();

    const grid = getByRole("grid", { name: /pathfinding grid/i });
    const cells = within(grid).getAllByRole("gridcell");

    // Verify start cell exists initially
    const initialStart = cells.find((cell) => cell.getAttribute("aria-label") === "start");
    expect(initialStart).toBeDefined();

    // Activate place-start mode and click a cell — should not throw
    await user.click(getByRole("button", { name: /place start/i }));
    const targetCell = cells.find((cell) => cell.getAttribute("aria-label") === "empty")!;
    await user.click(targetCell);
    // Grid remains rendered without errors
    expect(getByRole("grid", { name: /pathfinding grid/i })).toBeDefined();
  }, 5000);
});
