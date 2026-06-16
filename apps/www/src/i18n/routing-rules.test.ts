import { describe, expect, it } from "vitest";

import { localeRedirects } from "./routing-rules";

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

type Rule = {
  has?: readonly { type: string }[];
  missing?: readonly { type: string }[];
  source: string;
  destination: string;
};

const hasCookie = (rule: Rule) => rule.has?.some((cond) => cond.type === "cookie") ?? false;
const hasHeader = (rule: Rule) => rule.has?.some((cond) => cond.type === "header") ?? false;
const isUnconditional = (rule: Rule) => rule.has === undefined && rule.missing === undefined;
const isDeepSource = (rule: Rule) => rule.source.startsWith("/:path(");

describe(localeRedirects, () => {
  const redirects = localeRedirects();

  it("redirects unprefixed default-locale paths to the prefixed route", () => {
    expect.assertions(2);
    // Every locale is prefixed (localePrefix: "always"), so the bare root and
    // any unprefixed deep path fall back to the default locale's prefix.
    expect(redirects).toContainEqual({ destination: "/en", permanent: false, source: "/" });
    const deepFallback = redirects.find(
      (redirect) => isDeepSource(redirect) && isUnconditional(redirect),
    );
    expect(deepFallback?.destination).toBe("/en/:path");
  }, 5000);

  it("never strips the /en prefix (prefixed URLs are canonical now)", () => {
    expect.assertions(1);
    const stripRule = redirects.find((redirect) => redirect.source.startsWith("/en"));
    expect(stripRule).toBeUndefined();
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

  it("evaluates the default-locale fallback last", () => {
    expect.assertions(1);
    // The unconditional fallback must come after every cookie/header rule, or
    // it would shadow detection.
    const lastConditionalIndex = redirects.findLastIndex(
      (redirect) => hasCookie(redirect) || hasHeader(redirect),
    );
    const firstFallbackIndex = redirects.findIndex((redirect) => isUnconditional(redirect));
    expect(firstFallbackIndex).toBeGreaterThan(lastConditionalIndex);
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
