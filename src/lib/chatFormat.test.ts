import test from "node:test";
import assert from "node:assert/strict";
import { formatChatText } from "./chatFormat";

type RenderedNode = { type?: unknown; props?: Record<string, unknown> };

function render(text: string): RenderedNode[] {
  return formatChatText(text) as unknown as RenderedNode[];
}

/** Every element type in the tree, so a nested link cannot hide. */
function elementTypes(nodes: unknown[], found: string[] = []): string[] {
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const element = node as RenderedNode;
    if (typeof element.type === "string") found.push(element.type);
    const children = element.props?.children;
    if (Array.isArray(children)) elementTypes(children, found);
    else if (children && typeof children === "object") elementTypes([children], found);
  }
  return found;
}

function plainText(nodes: unknown[]): string {
  return nodes
    .map((node) => {
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      const element = node as RenderedNode;
      const children = element.props?.children;
      if (typeof children === "string") return children;
      if (Array.isArray(children)) return plainText(children);
      return "";
    })
    .join("");
}

test.beforeEach(() => {
  (globalThis as { window?: unknown }).window = {
    location: { origin: "https://hub.test" },
  };
});

test("plain text passes through untouched", () => {
  assert.deepEqual(render("gg, rematch?"), ["gg, rematch?"]);
});

test("bold, italic, strike and code become elements", () => {
  assert.equal(render("**bold**")[0].type, "strong");
  assert.equal(render("*soft*")[0].type, "em");
  assert.equal(render("~~gone~~")[0].type, "s");
  assert.equal(render("`npm test`")[0].type, "code");
  assert.equal(plainText(render("**bold**")), "bold");
});

test("markdown links keep the label and resolve https targets", () => {
  const [link] = render("[site](https://example.com/x)");
  assert.equal(link.type, "a");
  assert.equal(link.props?.href, "https://example.com/x");
  assert.equal(link.props?.children, "site");
  assert.equal(link.props?.rel, "noopener noreferrer");
  assert.equal(link.props?.target, "_blank");
});

test("a javascript: target never becomes a link", () => {
  const nodes = render("[click me](javascript:alert(1))");
  assert.deepEqual(elementTypes(nodes), [], "no element may be produced for a javascript: URL");
  assert.equal(plainText(nodes), "[click me](javascript:alert(1))");
});

test("a data: target never becomes a link", () => {
  const nodes = render("[x](data:text/html,<script>alert(1)</script>)");
  assert.deepEqual(elementTypes(nodes), []);
});

test("bare links work and trailing punctuation stays as text", () => {
  const nodes = render("see https://example.com/game.");
  assert.equal(nodes[0], "see ");
  const link = nodes[1] as RenderedNode;
  assert.equal(link.type, "a");
  assert.equal(link.props?.href, "https://example.com/game");
  assert.equal(nodes[2], ".");
});

test("formatting nested inside bold still renders", () => {
  // A shared, stateful matcher used to loop forever here, freezing the chat.
  const nodes = render("**a `b` c**");
  assert.deepEqual(elementTypes(nodes), ["strong", "code"]);
  assert.equal(plainText(nodes), "a b c");
});

test("bold can contain italic, the way people actually write it", () => {
  const nodes = render("**bold and *italic***");
  assert.deepEqual(elementTypes(nodes), ["strong", "em"]);
  assert.equal(plainText(nodes), "bold and italic", "no stray asterisks may survive");
  assert.equal((nodes[0] as RenderedNode).props?.children?.[0], "bold and ");
});

test("a single star inside bold does not need an italic partner", () => {
  const nodes = render("**2 * 3 = 6**");
  assert.deepEqual(elementTypes(nodes), ["strong"]);
  assert.equal(plainText(nodes), "2 * 3 = 6");
});

test("unclosed markers stay as plain text", () => {
  assert.deepEqual(render("**unclosed"), ["**unclosed"]);
  assert.deepEqual(render("****"), ["****"]);
});

test("formatting inside a sentence does not swallow the text around it", () => {
  const nodes = render("nice **run** today");
  assert.equal(nodes[0], "nice ");
  assert.equal((nodes[1] as RenderedNode).type, "strong");
  assert.equal(nodes[2], " today");
});

test("relative markdown links resolve against the hub origin", () => {
  const [link] = render("[settings](/settings)");
  assert.equal(link.type, "a");
  assert.equal(link.props?.href, "https://hub.test/settings");
});

test.afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});
