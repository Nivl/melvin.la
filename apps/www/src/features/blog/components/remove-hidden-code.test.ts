import { describe, expect, it } from "vitest";

import type { MdastNode } from "./remove-hidden-code";
import { removeHiddenCode } from "./remove-hidden-code";

describe(removeHiddenCode, () => {
  it("strips top-level fenced code blocks whose language is `hidden`", () => {
    expect.assertions(1);
    const tree: MdastNode = {
      children: [
        { lang: "hidden", type: "code" },
        { lang: "go", type: "code" },
        { type: "paragraph" },
      ],
      type: "root",
    };

    removeHiddenCode()(tree);

    expect(tree.children).toStrictEqual([{ lang: "go", type: "code" }, { type: "paragraph" }]);
  }, 5000);

  it("removes hidden fences nested below the root", () => {
    expect.assertions(1);
    const tree: MdastNode = {
      children: [
        {
          children: [
            { lang: "hidden", type: "code" },
            { lang: "typescript", type: "code" },
          ],
          type: "blockquote",
        },
      ],
      type: "root",
    };

    removeHiddenCode()(tree);

    expect(tree.children?.[0].children).toStrictEqual([{ lang: "typescript", type: "code" }]);
  }, 5000);

  it("keeps code blocks that have no language or a non-hidden language", () => {
    expect.assertions(1);
    const tree: MdastNode = {
      children: [{ type: "code" }, { lang: "bash", type: "code" }, { type: "inlineCode" }],
      type: "root",
    };

    removeHiddenCode()(tree);

    expect(tree.children).toStrictEqual([
      { type: "code" },
      { lang: "bash", type: "code" },
      { type: "inlineCode" },
    ]);
  }, 5000);
});
