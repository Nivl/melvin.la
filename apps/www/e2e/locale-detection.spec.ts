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

test("serves English at / for English browsers", async ({ request }) => {
  const response = await request.get("/", {
    headers: { "Accept-Language": "en-US,en;q=0.9" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(200);
});

test("ignores secondary language preferences", async ({ request }) => {
  const response = await request.get("/", {
    headers: { "Accept-Language": "en-US,ja;q=0.9" },
    maxRedirects: 0,
  });

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

test("an explicit English choice disables detection", async ({ request }) => {
  const response = await request.get("/", {
    headers: {
      "Accept-Language": "ja,en-US;q=0.9",
      Cookie: "NEXT_LOCALE=en",
    },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(200);
});

test("a NEXT_LOCALE value outside the locale set also disables detection", async ({ request }) => {
  // Documented trade-off (see routing-rules.ts): per-rule `missing` can't
  // express "not in the locale set", so any cookie value pins the visitor
  // to the default locale.
  const response = await request.get("/", {
    headers: {
      "Accept-Language": "ja,en-US;q=0.9",
      Cookie: "NEXT_LOCALE=de",
    },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(200);
});

test("strips the /en prefix", async ({ request }) => {
  const response = await request.get("/en/blog", { maxRedirects: 0 });

  expect(response.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(response)).toBe("/blog");
});

test("forwards /en links to the detected locale for non-English browsers", async ({ request }) => {
  // Documented trade-off (see routing-rules.ts): the strip redirect cannot
  // set a cookie, so the follow-up unprefixed request is re-detected.
  const strip = await request.get("/en/blog", {
    headers: { "Accept-Language": "ja,en-US;q=0.9" },
    maxRedirects: 0,
  });

  expect(strip.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(strip)).toBe("/blog");

  const detect = await request.get("/blog", {
    headers: { "Accept-Language": "ja,en-US;q=0.9" },
    maxRedirects: 0,
  });

  expect(detect.status()).toBe(TEMPORARY_REDIRECT);
  expect(redirectedPath(detect)).toBe("/ja/blog");
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
