export type MdastNode = { type: string; lang?: string | null; children?: MdastNode[] };

const walk = (node: MdastNode) => {
  if (!node.children) {
    return;
  }
  node.children = node.children.filter(
    (child) => !(child.type === "code" && child.lang === "hidden"),
  );
  for (const child of node.children) {
    walk(child);
  }
};

// Drop diagram-source fences (```hidden) so they don't render. The diagrams
// themselves ship as pre-generated images; the source is kept in the MDX only
// for reference and must stay invisible. Used as a remark plugin in the blog
// MDX pipeline, before rehype-pretty-code highlights the surviving fences.
export const removeHiddenCode = () => walk;
