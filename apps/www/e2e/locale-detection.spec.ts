import type { APIResponse } from "./helpers";
import { expect, test } from "./helpers";

const TEMPORARY_REDIRECT = 307;

const redirectedPath = (response: APIResponse): string =>
  new URL(response.headers().location, "http://localhost:3000").pathname;

test("redirects the home page to the browser's primary language", async ({ request }) => {
  const response = await request.get("/", {
    headers: { "Accept-Language": "ja,en-US;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/ja");
});

test("redirects Traditional Chinese browsers to zh-tw", async ({ request }) => {
  const response = await request.get("/", {
    headers: { "Accept-Language": "zh-TW,zh;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/zh-tw");
});

test("redirects Simplified Chinese browsers to zh", async ({ request }) => {
  const response = await request.get("/", {
    headers: { "Accept-Language": "zh-CN,zh;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/zh");
});

test("redirects the bare root to the default-locale prefix for English browsers", async ({
  request,
}) => {
  const response = await request.get("/", {
    headers: { "Accept-Language": "en-US,en;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/en");
});

test("ignores secondary language preferences", async ({ request }) => {
  const response = await request.get("/", {
    headers: { "Accept-Language": "en-US,ja;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/en");
});

test("serves prefixed locale routes directly, without redirecting", async ({ request }) => {
  const response = await request.get("/en", { maxRedirects: 0 });

  expect(response.status()).toBe(200);
});

test("redirects deep paths based on the browser language", async ({ request }) => {
  const response = await request.get("/blog", {
    headers: { "Accept-Language": "ja,en-US;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/ja/blog");
});

test("keeps every segment when redirecting multi-segment paths", async ({ request }) => {
  // The redirect rules capture the whole remaining path into a single
  // ':path' param; this pins that embedded slashes survive interpolation.
  const response = await request.get("/blog/reverse-prompt-engineering", {
    headers: { "Accept-Language": "ja,en-US;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/ja/blog/reverse-prompt-engineering");
});

test("redirects deep paths based on the NEXT_LOCALE cookie", async ({ request }) => {
  const response = await request.get("/blog", {
    headers: { Cookie: "NEXT_LOCALE=fr" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/fr/blog");
});

test("prioritizes the NEXT_LOCALE cookie over the browser language", async ({ request }) => {
  const response = await request.get("/", {
    headers: {
      "Accept-Language": "ja,en-US;q=0.9",
      Cookie: "NEXT_LOCALE=fr",
    },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/fr");
});

test("an explicit English choice routes to /en over the browser language", async ({ request }) => {
  const response = await request.get("/", {
    headers: {
      "Accept-Language": "ja,en-US;q=0.9",
      Cookie: "NEXT_LOCALE=en",
    },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/en");
});

test("a NEXT_LOCALE value outside the locale set falls back to the default locale", async ({
  request,
}) => {
  // Documented trade-off (see routing-rules.ts): per-rule `missing` can't
  // express "not in the locale set", so any cookie value disables detection
  // and the visitor falls through to the default locale.
  const response = await request.get("/", {
    headers: {
      "Accept-Language": "ja,en-US;q=0.9",
      Cookie: "NEXT_LOCALE=de",
    },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/en");
});

test("never redirects API routes", async ({ request }) => {
  const response = await request.get("/api/health", {
    headers: { "Accept-Language": "ja,en-US;q=0.9" },
    maxRedirects: 0,
  });

  // The health route answers 204; anything but a redirect proves the
  // locale rules left the request alone.
  expect(response.status()).toBe(204);
});
