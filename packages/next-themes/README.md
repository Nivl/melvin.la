# next-themes

This is a fork of [pacocoursey/next-themes](https://github.com/pacocoursey/next-themes).

Main list of changes:

- Make the code compatible with TypeScript 6
  - Remove build system
  - theme is now called appearance, and can be light, dark, or system
  - theme families are now called themes, and are separate from appearance

---

An abstraction for themes in your React app.

- ✅ Perfect dark mode in 2 lines of code
- ✅ System setting with prefers-color-scheme
- ✅ Themed browser UI with color-scheme
- ✅ Support for Next.js 13 `appDir`
- ✅ No flash on load (both SSR and SSG)
- ✅ Sync theme across tabs and windows
- ✅ Disable flashing when changing themes
- ✅ Force pages to specific themes
- ✅ Class or data attribute selector
- ✅ `useTheme` hook

Check out the [Live Example](https://next-themes-example.vercel.app/) to try it for yourself.

## Use

### With app/

You'll need to update your `app/layout.jsx` to use next-themes. The simplest `layout` looks like this:

```jsx
// app/layout.jsx
export default function Layout({ children }) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
}
```

Adding dark mode support takes 2 lines of code:

```jsx
// app/layout.jsx
import { ThemeProvider } from "@melvinla/next-themes";

export default function Layout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

Note that `ThemeProvider` is a client component, not a server component.

> **Note!** If you do not add [suppressHydrationWarning](https://reactjs.org/docs/dom-elements.html#suppresshydrationwarning:~:text=It%20only%20works%20one%20level%20deep) to your `<html>` you will get warnings because `next-themes` updates that element. This property only applies one level deep, so it won't block hydration warnings on other elements.

### HTML & CSS

That's it, your Next.js app fully supports dark mode, including System preference with `prefers-color-scheme`. The theme is also immediately synced between tabs. By default, next-themes sets the `data-appearance` attribute on the `html` element to the resolved appearance (`light` or `dark`), which you can use to style your app:

```css
:root {
  /* Your default theme */
  --background: white;
  --foreground: black;
}

[data-appearance="dark"] {
  --background: black;
  --foreground: white;
}
```

> **Note!** If you set the attribute of your Theme Provider to class for Tailwind next-themes will modify the `class` attribute on the `html` element. See [With TailwindCSS](#with-tailwindcss).

### useTheme

Your UI will need to know the current appearance/theme and be able to change it. The `useTheme` hook provides this information:

```jsx
import { useTheme } from "@melvinla/next-themes";

const ThemeChanger = () => {
  const { appearance, setAppearance } = useTheme();

  return (
    <div>
      The current appearance is: {appearance}
      <button onClick={() => setAppearance("light")}>Light</button>
      <button onClick={() => setAppearance("dark")}>Dark</button>
      <button onClick={() => setAppearance("system")}>System</button>
    </div>
  );
};
```

> **Warning!** The above code is hydration _unsafe_ and will throw a hydration mismatch warning when rendering with SSG or SSR. This is because we cannot know the `theme` on the server, so it will always be `undefined` until mounted on the client.
>
> You should delay rendering any theme toggling UI until mounted on the client. See the [example](#avoid-hydration-mismatch).

## API

Let's dig into the details.

### ThemeProvider

All your theme configuration is passed to ThemeProvider.

- `defaultAppearance = 'system'`: Default appearance (`light`, `dark`, or `system`). When `enableSystem` is false, the default is `light`
- `defaultTheme`: Default theme family name (e.g. `'pink'`)
- `forcedAppearance`: Forced appearance for the current page (does not modify saved settings)
- `forcedTheme`: Forced theme family for the current page (does not modify saved settings)
- `enableSystem = true`: Whether to follow `prefers-color-scheme` when appearance is `'system'`
- `enableColorScheme = true`: Whether to set `color-scheme` on `<html>` so browsers render built-in UI (inputs, scrollbars, etc.) in the correct palette
- `disableTransitionOnChange = false`: Optionally disable all CSS transitions when switching themes ([example](#disable-transitions-on-theme-change))
- `themes = []`: List of named theme family names (e.g. `['pink', 'blue']`)
- `appearanceAttribute = 'data-appearance'`: HTML attribute modified based on the resolved appearance (`light` or `dark`)
  - accepts `class` and `data-*` ([example](#class-instead-of-data-attribute))
- `themeAttribute = 'data-theme'`: HTML attribute modified based on the active theme family
  - accepts `class` and `data-*`
- `appearanceStorageKey = 'appearance'`: localStorage key used to persist the appearance
- `themeStorageKey = 'theme'`: localStorage key used to persist the theme family
- `appearanceValue`: Optional mapping of appearance name to attribute value
- `themeValue`: Optional mapping of theme family name to attribute value ([example](#differing-dom-attribute-and-theme-name))
- `nonce`: Optional nonce passed to the injected `script` tag, used to allow-list the next-themes script in your CSP
- `scriptProps`: Optional props to pass to the injected `script` tag ([example](#using-with-cloudflare-rocket-loader))

### useTheme

useTheme takes no parameters, but returns:

- `appearance`: Active appearance value — `'light'`, `'dark'`, or `'system'`
- `setAppearance(value)`: Update the appearance. Accepts `'light'`, `'dark'`, or `'system'`. API identical to the [set function](https://react.dev/reference/react/useState#setstate) returned by `useState`
- `resolvedAppearance`: The concrete appearance after resolving `'system'` to `'light'` or `'dark'` based on `prefers-color-scheme`. Otherwise identical to `appearance`
- `systemAppearance`: The current OS appearance preference (`'dark'` or `'light'`), regardless of the selected appearance
- `theme`: Active named theme family (e.g. `'pink'`), or `undefined` when no theme families are configured
- `setTheme(name)`: Update the theme family. API identical to the [set function](https://react.dev/reference/react/useState#setstate) returned by `useState`
- `forcedAppearance`: Forced page appearance or `undefined`. If set, you should disable any appearance-switching UI
- `forcedTheme`: Forced page theme family or `undefined`. If set, you should disable any theme-switching UI
- `themes`: The list of theme family names passed to `ThemeProvider`

Quick reference — all returned members:

```jsx
const {
  appearance,
  resolvedAppearance,
  systemAppearance,
  setAppearance,
  theme,
  setTheme,
  forcedAppearance,
  forcedTheme,
  themes,
} = useTheme();
```

Not too bad, right? Let's see how to use these properties with examples:

## Examples

The [Live Example](https://next-themes-example.vercel.app/) shows next-themes in action, with dark, light, system themes and pages with forced themes.

### Use System preference by default

The `defaultAppearance` is automatically set to `"system"`, so to follow the OS preference you can simply use:

```jsx
<ThemeProvider>
```

### Ignore System preference

If you want a different starting point, set `defaultAppearance` — the user can still manually pick `"system"` later:

```jsx
<ThemeProvider defaultAppearance="light">
```

To remove `"system"` as a valid option entirely (no OS listener, no system choice in your UI), use `enableSystem={false}`:

```jsx
<ThemeProvider enableSystem={false}>
```

### Class instead of data attribute

If your Next.js app uses a class to style the page based on the appearance, change the `appearanceAttribute` prop to `class`:

```jsx
<ThemeProvider appearanceAttribute="class">
```

Now, setting the appearance to `"dark"` will set `class="dark"` on the `html` element.

### Force page to an appearance

Let's say your cool new marketing page is dark mode only. The page should always use the dark appearance, and changing the appearance should have no effect. To force an appearance on your Next.js pages, simply set a variable on the page component:

```js
// pages/awesome-page.js

const Page = () => { ... }
Page.appearance = 'dark'
export default Page
```

In your `_app`, read the variable and pass it to ThemeProvider:

```jsx
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider forcedAppearance={Component.appearance || null}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

Done! Your page is always dark (regardless of user preference), and calling `setAppearance` from `useTheme` is now a no-op. However, you should make sure to disable any of your UI that would normally change the appearance:

```js
const { forcedAppearance } = useTheme();

// Appearance is forced, we shouldn't allow user to change it
const disabled = !!forcedAppearance;
```

### Disable transitions on theme change

I wrote about [this technique here](https://paco.sh/blog/disable-theme-transitions). We can forcefully disable all CSS transitions before the theme is changed, and re-enable them immediately afterwards. This ensures your UI with different transition durations won't feel inconsistent when changing the theme.

To enable this behavior, pass the `disableTransitionOnChange` prop:

```jsx
<ThemeProvider disableTransitionOnChange>
```

### Differing DOM attribute and theme name

The active theme family name is used as both the localStorage value and the value of the DOM attribute. If the theme family is "pink", localStorage will contain `theme=pink` and the DOM will be `data-theme="pink"`. You **cannot** modify the localStorage value, but you **can** modify the DOM value.

If we want the DOM to instead render `data-theme="my-pink-theme"` when the theme family is "pink", pass the `themeValue` prop:

```jsx
<ThemeProvider themeValue={{ pink: 'my-pink-theme' }}>
```

Done! To be extra clear, this affects only the DOM. Here's how all the values will look:

```js
const { theme } = useTheme();
// => "pink"

localStorage.getItem("theme");
// => "pink"

document.documentElement.getAttribute("data-theme");
// => "my-pink-theme"
```

### Using with Cloudflare Rocket Loader

[Rocket Loader](https://developers.cloudflare.com/fundamentals/speed/rocket-loader/) is a Cloudflare optimization that defers the loading of inline and external scripts to prioritize the website content. Since next-themes relies on a script injection to avoid screen flashing on page load, Rocket Loader breaks this functionality. Individual scripts [can be ignored](https://developers.cloudflare.com/fundamentals/speed/rocket-loader/ignore-javascripts/) by adding the `data-cfasync="false"` attribute to the script tag:

```jsx
<ThemeProvider scriptProps={{ 'data-cfasync': 'false' }}>
```

### More than light and dark mode

next-themes uses a two-axis model: **appearance** (`light`, `dark`, `system`) controls the light/dark axis, while a separate **theme family** axis handles named palettes like `pink` or `blue`.

Pass your named theme families to `ThemeProvider`:

```jsx
<ThemeProvider themes={['pink', 'red', 'blue']}>
```

Style them with composed CSS selectors that target both axes independently:

```css
[data-theme="pink"][data-appearance="dark"] {
  --background: #120f1f;
  --foreground: white;
}

[data-theme="pink"][data-appearance="light"] {
  --background: #fff0f5;
  --foreground: black;
}
```

When `appearance="system"` and `theme="pink"`, next-themes keeps `data-theme="pink"` constant and only toggles `data-appearance` between `"light"` and `"dark"` as the OS preference changes.

Use composed selectors like `[data-theme='pink'][data-appearance='dark']` or `.pink.dark` instead of flattened names like `pink-dark`.

For a full example, check out the [multi-theme example](./examples/multi-theme/README.md)

### Without CSS variables

This library does not rely on your theme styling using CSS variables. You can hard-code the values in your CSS, and everything will work as expected (without any flashing):

```css
html,
body {
  color: #000;
  background: #fff;
}

[data-appearance="dark"],
[data-appearance="dark"] body {
  color: #fff;
  background: #000;
}
```

### With Styled Components and any CSS-in-JS

Next Themes is completely CSS independent, it will work with any library. For example, with Styled Components you just need to `createGlobalStyle` in your custom App:

```jsx
// pages/_app.js
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "@melvinla/next-themes";

// Your themeing variables
const GlobalStyle = createGlobalStyle`
  :root {
    --fg: #000;
    --bg: #fff;
  }

  [data-appearance="dark"] {
    --fg: #fff;
    --bg: #000;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
```

### Avoid Hydration Mismatch

Because we cannot know the `theme` on the server, many of the values returned from `useTheme` will be `undefined` until mounted on the client. This means if you try to render UI based on the current theme before mounting on the client, you will see a hydration mismatch error.

The following code sample is **unsafe**:

```jsx
import { useTheme } from "@melvinla/next-themes";

// Do NOT use this! It will throw a hydration mismatch error.
const ThemeSwitch = () => {
  const { appearance, setAppearance } = useTheme();

  return (
    <select value={appearance} onChange={(e) => setAppearance(e.target.value)}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};

export default ThemeSwitch;
```

To fix this, make sure you only render UI that uses the current theme when the page is mounted on the client:

```jsx
import { useState, useEffect } from "react";
import { useTheme } from "@melvinla/next-themes";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { appearance, setAppearance } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <select value={appearance} onChange={(e) => setAppearance(e.target.value)}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};

export default ThemeSwitch;
```

Alternatively, you could lazy load the component on the client side. The following example uses `next/dynamic` but you could also use `React.lazy`:

```js
import dynamic from "next/dynamic";

const ThemeSwitch = dynamic(() => import("./ThemeSwitch"), { ssr: false });

const ThemePage = () => {
  return (
    <div>
      <ThemeSwitch />
    </div>
  );
};

export default ThemePage;
```

To avoid [Layout Shift](https://web.dev/cls/), consider rendering a skeleton/placeholder until mounted on the client side.

#### Images

Showing different images based on the current theme also suffers from the hydration mismatch problem. With [`next/image`](https://nextjs.org/docs/basic-features/image-optimization) you can use an empty image until the theme is resolved:

```jsx
import Image from "next/image";
import { useTheme } from "@melvinla/next-themes";

function ThemedImage() {
  const { resolvedAppearance } = useTheme();
  let src;

  switch (resolvedAppearance) {
    case "light":
      src = "/light.png";
      break;
    case "dark":
      src = "/dark.png";
      break;
    default:
      src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      break;
  }

  return <Image src={src} width={400} height={400} />;
}

export default ThemedImage;
```

#### CSS

You can also use CSS to hide or show content based on the current theme. To avoid the hydration mismatch, you'll need to render _both_ versions of the UI, with CSS hiding the unused version. For example:

```jsx
function ThemedImage() {
  return (
    <>
      {/* When the appearance is dark, hide this div */}
      <div data-hide-on-appearance="dark">
        <Image src="light.png" width={400} height={400} />
      </div>

      {/* When the appearance is light, hide this div */}
      <div data-hide-on-appearance="light">
        <Image src="dark.png" width={400} height={400} />
      </div>
    </>
  );
}

export default ThemedImage;
```

```css
[data-appearance="dark"] [data-hide-on-appearance="dark"],
[data-appearance="light"] [data-hide-on-appearance="light"] {
  display: none;
}
```

### With TailwindCSS

[Visit the live example](https://next-themes-tailwind.vercel.app) • [View the example source code](https://github.com/pacocoursey/next-themes/tree/master/examples/tailwind)

> NOTE! Tailwind only supports dark mode in version >2.

In your `tailwind.config.js`, set the dark mode property to `selector`:

```js
// tailwind.config.js
module.exports = {
  darkMode: "selector",
};
```

_Note: If you are using an older version of tailwindcss < 3.4.1 use `'class'` instead of `'selector'`_

Set the attribute for your Theme Provider to class:

```tsx
// pages/_app.tsx
<ThemeProvider appearanceAttribute="class">
```

If you're using the `appearanceValue` prop to specify different attribute values, make sure your dark appearance explicitly uses the `"dark"` value, as required by Tailwind.

That's it! Now you can use dark-mode specific classes:

```tsx
<h1 className="text-black dark:text-white">
```

#### Using a custom selector (tailwindcss > 3.4.1)

Tailwind also allows you to use a [custom selector](https://tailwindcss.com/docs/dark-mode#customizing-the-selector) for dark-mode as of v3.4.1.

In that case, your `tailwind.config.js` would look like this:

```js
// tailwind.config.js
module.exports = {
  // data-mode is used as an example, next-themes supports using any data attribute
  darkMode: ['selector', '[data-mode="dark"]']
  …
}
```

Now set the attribute for your ThemeProvider to `data-mode`:

```tsx
// pages/_app.tsx
<ThemeProvider appearanceAttribute="data-mode">
```

With this setup, you can now use Tailwind's dark mode classes, as in the previous example:

## Discussion

### The Flash

ThemeProvider automatically injects a script into `next/head` to update the `html` element with the correct attributes before the rest of your page loads. This means the page will not flash under any circumstances, including forced themes, system theme, multiple themes, and incognito. No `noflash.js` required.

## FAQ

---

**Why is my page still flashing?**

In Next.js dev mode, the page may still flash. When you build your app in production mode, there will be no flashing.

---

**Why do I get server/client mismatch error?**

When using `useTheme`, you will use see a hydration mismatch error when rendering UI that relies on the current theme. This is because many of the values returned by `useTheme` are undefined on the server, since we can't read `localStorage` until mounting on the client. See the [example](#avoid-hydration-mismatch) for how to fix this error.

---

**Do I need to use CSS variables with this library?**

Nope. See the [example](#without-css-variables).

---

**Can I set the class or data attribute on the body or another element?**

Nope. If you have a good reason for supporting this feature, please open an issue.

---

**Can I use this package with Gatsby or CRA?**

Yes, starting from the 0.3.0 version.

---

**Is the injected script minified?**

Yes.

---

**Why is `resolvedAppearance` necessary?**

When supporting the System appearance preference, you want to make sure that's reflected in your UI. This means your buttons, selects, dropdowns, or whatever you use to indicate the current appearance should say "System" when the System preference is active.

If we didn't distinguish between `appearance` and `resolvedAppearance`, the UI would show "Dark" or "Light", when it should really be "System".

`resolvedAppearance` is then useful for modifying behavior or styles at runtime:

```jsx
const { resolvedAppearance } = useTheme()

<div style={{ color: resolvedAppearance === 'dark' ? 'white' : 'black' }}>
```

If we didn't have `resolvedAppearance` and only used `appearance`, you'd lose information about the state of your UI (you would only know the appearance is "system", and not what it resolved to).
