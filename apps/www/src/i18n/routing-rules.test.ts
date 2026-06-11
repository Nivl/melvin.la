import { describe, expect, it } from "vitest";

import { localeRedirects, localeRewrites } from "./routing-rules";

const nonDefaultLocales = ["fr", "es", "ko", "zh", "zh-tw", "ja"] as const;

// Mirrors how Next.js compiles a `/:path(REGEX)` source: the custom pattern
// is anchored against the full path, minus the leading slash.
const compileSource = (source: string | undefined): RegExp => {
  const match = /^\/:path\((?<pattern>.*)\)$/su.exec(source ?? "");
  if (match?.groups?.pattern === undefined) {
    throw new Error(`unexpected source shape: ${source ?? "undefined"}`);
  }
  return new RegExp(`^/(?:${match.groups.pattern})$`, "u");
};

// Mirrors how Next.js compiles a `has`/`missing` value: anchored full match.
const compileHasValue = (value: string | undefined): RegExp =>
  new RegExp(`^(?:${value ?? ""})$`, "u");

type Rule = { has?: readonly { type: string }[]; source: string };

const hasCookie = (rule: Rule) => rule.has?.some((cond) => cond.type === "cookie") ?? false;
const hasHeader = (rule: Rule) => rule.has?.some((cond) => cond.type === "header") ?? false;
const isDeepSource = (rule: Rule) => rule.source.startsWith("/:path(");

describe(localeRedirects, () => {
  const redirects = localeRedirects();

  it("strips the /en prefix with temporary redirects", () => {
    expect.assertions(2);
    expect(redirects).toContainEqual({ destination: "/", permanent: false, source: "/en" });
    expect(redirects).toContainEqual({
      destination: "/:path*",
      permanent: false,
      source: "/en/:path*",
    });
  }, 5000);

  it("redirects the root path based on the NEXT_LOCALE cookie", () => {
    expect.assertions(6);
    for (const locale of nonDefaultLocales) {
      expect(redirects).toContainEqual({
        destination: `/${locale}`,
        has: [{ key: "NEXT_LOCALE", type: "cookie", value: locale }],
        permanent: false,
        source: "/",
      });
    }
  }, 5000);

  it("redirects deep paths based on the NEXT_LOCALE cookie", () => {
    expect.assertions(6);
    for (const locale of nonDefaultLocales) {
      const rule = redirects.find(
        (redirect) =>
          isDeepSource(redirect) &&
          redirect.has?.some((cond) => cond.type === "cookie" && cond.value === locale),
      );
      expect(rule?.destination).toBe(`/${locale}/:path`);
    }
  }, 5000);

  it("only applies Accept-Language detection when no locale cookie is set", () => {
    expect.assertions(2);
    const headerRules = redirects.filter((redirect) => hasHeader(redirect));
    // Root + deep variant for each non-default locale
    expect(headerRules).toHaveLength(nonDefaultLocales.length * 2);
    expect(
      headerRules.every((rule) =>
        rule.missing?.some((cond) => cond.type === "cookie" && cond.key === "NEXT_LOCALE"),
      ),
    ).toBe(true);
  }, 5000);

  it("evaluates Traditional Chinese before generic Chinese", () => {
    expect.assertions(2);
    const zhTwIndex = redirects.findIndex(
      (redirect) => hasHeader(redirect) && redirect.destination === "/zh-tw",
    );
    const zhIndex = redirects.findIndex(
      (redirect) => hasHeader(redirect) && redirect.destination === "/zh",
    );
    expect(zhTwIndex).toBeGreaterThanOrEqual(0);
    expect(zhTwIndex).toBeLessThan(zhIndex);
  }, 5000);

  it("prioritizes an explicit cookie choice over Accept-Language detection", () => {
    expect.assertions(2);
    const firstHeaderIndex = redirects.findIndex((redirect) => hasHeader(redirect));
    const lastCookieIndex = redirects.findLastIndex((redirect) => hasCookie(redirect));
    expect(lastCookieIndex).toBeGreaterThanOrEqual(0);
    expect(lastCookieIndex).toBeLessThan(firstHeaderIndex);
  }, 5000);

  it("matches real browser Accept-Language headers", () => {
    expect.assertions(14);
    const patternFor = (locale: string) => {
      const rule = redirects.find(
        (redirect) =>
          redirect.source === "/" && hasHeader(redirect) && redirect.destination === `/${locale}`,
      );
      return compileHasValue(rule?.has?.find((cond) => cond.type === "header")?.value);
    };

    const ja = patternFor("ja");
    expect(ja.test("ja,en-US;q=0.9")).toBe(true);
    expect(ja.test("ja-JP,ja;q=0.9,en;q=0.8")).toBe(true);
    // Longer language codes sharing the prefix are different languages.
    expect(ja.test("jam,en;q=0.9")).toBe(false);

    const ko = patternFor("ko");
    expect(ko.test("ko-KR,ko;q=0.9")).toBe(true);
    expect(ko.test("kok-IN,kok;q=0.9")).toBe(false);

    const zhTw = patternFor("zh-tw");
    expect(zhTw.test("zh-TW,zh;q=0.9")).toBe(true);
    expect(zhTw.test("zh-Hant-TW,zh-Hant;q=0.9")).toBe(true);
    expect(zhTw.test("zh-HK,zh-TW;q=0.9,zh;q=0.8")).toBe(true);
    expect(zhTw.test("zh-CN,zh;q=0.9")).toBe(false);
    // Non-canonical casing (curl, webviews) must not fall through to the
    // Simplified rule.
    expect(zhTw.test("zh-tw,zh;q=0.9")).toBe(true);
    expect(zhTw.test("zh-hant,zh;q=0.9")).toBe(true);

    const zh = patternFor("zh");
    expect(zh.test("zh-CN,zh;q=0.9")).toBe(true);
    expect(zh.test("zh,en;q=0.8")).toBe(true);

    // A secondary language preference must not trigger a redirect.
    const fr = patternFor("fr");
    expect(fr.test("en-US,fr;q=0.9")).toBe(false);
  }, 5000);

  it("never redirects internal, static, or already-localized paths", () => {
    expect.assertions(13);
    const rule = redirects.find((redirect) => isDeepSource(redirect) && hasCookie(redirect));
    const source = compileSource(rule?.source);

    expect(source.test("/blog")).toBe(true);
    expect(source.test("/blog/some-post")).toBe(true);
    expect(source.test("/games/conway")).toBe(true);

    expect(source.test("/api/trpc/hello")).toBe(false);
    // The bare paths too, not just slash-suffixed ones.
    expect(source.test("/api")).toBe(false);
    expect(source.test("/_next")).toBe(false);
    expect(source.test("/_vercel")).toBe(false);
    expect(source.test("/_next/image")).toBe(false);
    expect(source.test("/_vercel/insights/script.js")).toBe(false);
    expect(source.test("/favicon.ico")).toBe(false);
    expect(source.test("/assets/blog/foo/cover.avif")).toBe(false);
    expect(source.test("/fr")).toBe(false);
    expect(source.test("/zh-tw/blog")).toBe(false);
  }, 5000);
});

describe(localeRewrites, () => {
  const rewrites = localeRewrites();

  it("serves the default locale for unprefixed paths", () => {
    expect.assertions(2);
    expect(rewrites).toContainEqual({ destination: "/en", source: "/" });
    const deep = rewrites.find((rewrite) => isDeepSource(rewrite));
    expect(deep?.destination).toBe("/en/:path");
  }, 5000);

  it("leaves internal, static, and localized paths untouched", () => {
    expect.assertions(7);
    const deep = rewrites.find((rewrite) => isDeepSource(rewrite));
    const source = compileSource(deep?.source);

    expect(source.test("/blog")).toBe(true);
    expect(source.test("/tools/uuid")).toBe(true);

    expect(source.test("/fr")).toBe(false);
    expect(source.test("/fr/blog")).toBe(false);
    expect(source.test("/api/trpc/hello")).toBe(false);
    expect(source.test("/_next/static/chunk.js")).toBe(false);
    expect(source.test("/robots.txt")).toBe(false);
  }, 5000);
});
