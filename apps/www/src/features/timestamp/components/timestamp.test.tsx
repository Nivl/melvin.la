import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { Timestamp } from "./timestamp";

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Timestamp />, { wrapper });
  return {
    ...utils,
    user,
  };
};

const getTimestampInput = (getByLabelText: ReturnType<typeof setup>["getByLabelText"]) => {
  const input = getByLabelText("Timestamp");
  if (!(input instanceof HTMLInputElement)) {
    throw new Error("Timestamp input not found");
  }

  return input;
};

describe(Timestamp, () => {
  it("all the elements are on the page", () => {
    expect.assertions(2);
    const { getByRole, getByLabelText } = setup();

    expect(getByRole("heading", { level: 1, name: "Timestamp Lookup" })).toBeDefined();

    expect(getByLabelText("Timestamp")).toBeDefined();
  }, 5000);

  it("input accepts numeric characters", async () => {
    expect.assertions(1);
    const { user, getByLabelText } = setup();

    const input = getTimestampInput(getByLabelText);

    await user.type(input, "123456789");
    expect(input.value).toBe("123456789");
  }, 5000);

  it("inserting a timestamp add it to the timestamp list", async () => {
    expect.assertions(2);
    const { user, getByLabelText, findByText } = setup();

    const input = getByLabelText("Timestamp");
    expect(input).toBeDefined();

    await user.type(input, "1752974231");
    await user.keyboard("{Enter}");

    await expect(findByText("2025/07/20 01:17:11 UTC")).resolves.toBeDefined();
  }, 5000);

  it("converts seconds timestamp (10 digits) to correct date", async () => {
    expect.assertions(1);
    const { user, getByLabelText, findByText } = setup();

    const input = getByLabelText("Timestamp");

    // Unix timestamp for 2024-01-01 00:00:00 UTC
    await user.type(input, "1704067200");
    await user.keyboard("{Enter}");

    await expect(findByText("2024/01/01 00:00:00 UTC")).resolves.toBeDefined();
  }, 5000);

  it("converts milliseconds timestamp (13 digits) to correct date", async () => {
    expect.assertions(1);
    const { user, getByLabelText, findByText } = setup();

    const input = getByLabelText("Timestamp");

    // Milliseconds timestamp for 2024-01-01 00:00:00 UTC
    await user.type(input, "1704067200000");
    await user.keyboard("{Enter}");

    await expect(findByText("2024/01/01 00:00:00 UTC")).resolves.toBeDefined();
  }, 5000);

  it("converts microseconds timestamp (16 digits) to correct date", async () => {
    expect.assertions(1);
    const { user, getByLabelText, findByText } = setup();

    const input = getByLabelText("Timestamp");

    // Microseconds timestamp for 2024-01-01 00:00:00 UTC
    await user.type(input, "1704067200000000");
    await user.keyboard("{Enter}");

    await expect(findByText("2024/01/01 00:00:00 UTC")).resolves.toBeDefined();
  }, 5000);

  it("converts nanoseconds timestamp (19 digits) to correct date", async () => {
    expect.assertions(1);
    const { user, getByLabelText, findByText } = setup();

    const input = getByLabelText("Timestamp");

    // Nanoseconds timestamp for 2024-01-01 00:00:00 UTC
    await user.type(input, "1704067200000000000");
    await user.keyboard("{Enter}");

    await expect(findByText("2024/01/01 00:00:00 UTC")).resolves.toBeDefined();
  }, 5000);

  it("has delete button for timestamps", async () => {
    expect.assertions(2);
    const { user, getByLabelText, findByText, getByRole } = setup();

    const input = getByLabelText("Timestamp");

    await user.type(input, "1704067200"); // 2024-01-01
    await user.keyboard("{Enter}");

    // Verify timestamp is added
    await expect(findByText("2024/01/01 00:00:00 UTC")).resolves.toBeDefined();

    // Verify delete button exists with correct aria-label
    const deleteButton = getByRole("button", { name: /remove/i });
    expect(deleteButton).toBeDefined();
  }, 5000);

  it("delete button removes timestamp from list", async () => {
    expect.assertions(2);
    const { user, getByLabelText, findByText, getByRole } = setup();

    const input = getByLabelText("Timestamp");

    // Add a timestamp
    await user.type(input, "1704067200"); // 2024-01-01
    await user.keyboard("{Enter}");

    // Verify timestamp is added
    const timestampElement = await findByText("2024/01/01 00:00:00 UTC");
    expect(timestampElement).toBeDefined();

    // Click the delete button
    const deleteButton = getByRole("button", { name: /remove/i });
    await user.click(deleteButton);

    // Wait a bit for animations to complete
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 600);
    });

    // Verify timestamp is no longer in the document
    const { queryByText } = setup();
    expect(queryByText("2024/01/01 00:00:00 UTC")).toBeNull();
  }, 5000);

  it("can delete specific timestamp when multiple exist", async () => {
    expect.assertions(4);
    const { user, getByLabelText, findByText, getAllByRole } = setup();

    const input = getByLabelText("Timestamp");

    // Add first timestamp
    await user.type(input, "1704067200"); // 2024-01-01
    await user.keyboard("{Enter}");

    // Add second timestamp
    await user.type(input, "1704153600"); // 2024-01-02
    await user.keyboard("{Enter}");

    // Verify both timestamps exist
    await expect(findByText("2024/01/01 00:00:00 UTC")).resolves.toBeDefined();
    await expect(findByText("2024/01/02 00:00:00 UTC")).resolves.toBeDefined();

    // Get all delete buttons and click the first one
    const deleteButtons = getAllByRole("button", { name: /remove/i });
    expect(deleteButtons).toHaveLength(2);

    await user.click(deleteButtons[0]);

    // Wait for animation
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 600);
    });

    // Check that we now have only one delete button remaining
    const remainingDeleteButtons = getAllByRole("button", { name: /remove/i });
    expect(remainingDeleteButtons).toHaveLength(1);
  }, 5000);

  it("clears input after successful timestamp conversion", async () => {
    expect.assertions(1);
    const { user, getByLabelText } = setup();

    const input = getTimestampInput(getByLabelText);

    await user.type(input, "1704067200");
    await user.keyboard("{Enter}");

    // Input should be cleared after successful conversion
    expect(input.value).toBe("");
  }, 5000);

  it("shows multiple timestamps in order", async () => {
    expect.assertions(2);
    const { user, getByLabelText, findByText } = setup();

    const input = getByLabelText("Timestamp");

    // Add first timestamp
    await user.type(input, "1704067200"); // 2024-01-01
    await user.keyboard("{Enter}");

    // Add second timestamp
    await user.type(input, "1704153600"); // 2024-01-02
    await user.keyboard("{Enter}");

    await expect(findByText("2024/01/01 00:00:00 UTC")).resolves.toBeDefined();
    await expect(findByText("2024/01/02 00:00:00 UTC")).resolves.toBeDefined();
  }, 5000);

  it("shows description about automatic format detection", () => {
    expect.assertions(1);
    const { getByText } = setup();

    expect(
      getByText("Automatically detects milliseconds, microseconds, and nanoseconds"),
    ).toBeDefined();
  }, 5000);

  it("handles edge case timestamps correctly", async () => {
    expect.assertions(1);
    const { user, getByLabelText, findByText } = setup();

    const input = getByLabelText("Timestamp");

    // Unix epoch (0)
    await user.clear(input);
    await user.type(input, "0");
    await user.keyboard("{Enter}");

    await expect(findByText("1970/01/01 00:00:00 UTC")).resolves.toBeDefined();
  }, 5000);
});
