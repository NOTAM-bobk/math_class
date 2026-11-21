import * as React from "react";

// Chat messages are plain text from the hub, so formatting is parsed into React
// nodes instead of HTML. Supported: **bold**, *italic*, ~~strike~~, `code`,
// [label](https://…) and bare http(s) links.
const LINK_CLASS =
  "break-all font-medium underline decoration-current/40 underline-offset-2 transition-opacity hover:opacity-80";

// A module-wide regex with the `g` flag cannot be shared with the recursive
// calls below: a nested call resets `lastIndex`, so the outer loop would match
// its first token again and never finish. Each call builds its own matcher.
// The bold group accepts a single `*` inside as long as it does not start a
// closing `**`, so `**bold and *italic***` nests instead of rendering a stray
// star. The optional trailing `*` lets the inner italic keep its closer.
const TOKEN_PATTERN =
  /\*\*((?:[^*\n]|\*(?!\*))+?\*?)\*\*|~~([^~\n]+)~~|`([^`\n]+)`|\*(?!\s)([^*\n]+?)\*|\[([^\]\n]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)|(https?:\/\/[^\s<>"'`]+)/;

const TRAILING_PUNCTUATION = /[.,!?;:]+$/;

function safeHref(raw: string): string | null {
  try {
    const url = new URL(raw, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function renderLink(raw: string, label: React.ReactNode, key: string) {
  const href = safeHref(raw);
  if (!href) return <React.Fragment key={key}>{label}</React.Fragment>;
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {label}
    </a>
  );
}

export function formatChatText(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;
  const pattern = new RegExp(TOKEN_PATTERN, "g");

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = `fmt-${tokenIndex++}`;

    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-zinc-100">
          {formatChatText(match[1])}
        </strong>
      );
    } else if (match[2] !== undefined) {
      nodes.push(
        <s key={key} className="opacity-70">
          {formatChatText(match[2])}
        </s>
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <code key={key} className="rounded bg-black/35 px-1 py-0.5 font-mono text-[11px] text-amber-200">
          {match[3]}
        </code>
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <em key={key} className="italic">
          {formatChatText(match[4])}
        </em>
      );
    } else if (match[5] !== undefined && match[6] !== undefined) {
      nodes.push(renderLink(match[6], match[5], key));
    } else if (match[7] !== undefined) {
      const trailing = match[7].match(TRAILING_PUNCTUATION)?.[0] ?? "";
      const clean = trailing ? match[7].slice(0, -trailing.length) : match[7];
      nodes.push(renderLink(clean, clean, key));
      if (trailing) nodes.push(trailing);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
