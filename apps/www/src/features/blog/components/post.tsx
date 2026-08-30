import { Link } from "@heroui/react";
import Image from "next/image";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import rehypePrettyCodePlugin from "rehype-pretty-code";

import { BlogHeading } from "#features/blog/components/blog-heading";
import { removeHiddenCode } from "#features/blog/components/remove-hidden-code";
import { BlogPost } from "#features/blog/models";
import { Link as NextLink } from "#i18n/routing";
import { Section } from "#shared/components/layout/section";

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  // Inline code stays a plain styled pill (see the `code` component), so leave
  // it untouched instead of running it through Shiki.
  bypassInlineCode: true,
  defaultLang: "plaintext",
  // Dual theme: Shiki emits both palettes as CSS variables and globals.css
  // switches between them based on the active appearance — no client-side JS.
  theme: { dark: "github-dark", light: "github-light" },
};

const mdxOptions: MDXRemoteProps["options"] = {
  blockJS: false,
  mdxOptions: {
    rehypePlugins: [[rehypePrettyCodePlugin, rehypePrettyCodeOptions]],
    remarkPlugins: [removeHiddenCode],
  },
};

const htmlToJsx: MDXRemoteProps["components"] = {
  Image,
  // eslint-disable-next-line id-length
  a: ({ children, href }: { children: React.ReactNode; href?: string }) => {
    if (href === undefined || href === "") {
      return <>{children}</>;
    }
    const isExternalLink = href.startsWith("http");
    if (isExternalLink) {
      return (
        <Link
          className="text-accent underline"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
          <Link.Icon />
        </Link>
      );
    }
    return (
      <NextLink className="link text-accent underline" href={href}>
        {children}
      </NextLink>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent pl-4 italic">{children}</blockquote>
  ),
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    // Fenced blocks are highlighted by rehype-pretty-code and carry
    // `data-language`. Render those as a plain <code> wrapping Shiki's per-token
    // spans (styled via the pre[data-theme] rules in globals.css); only inline
    // code gets the pill styling.
    if ("data-language" in props) {
      return <code>{children}</code>;
    }
    return (
      <code className="inline-block h-fit rounded-lg bg-default/70 px-2 py-1 font-monospace text-sm font-normal whitespace-nowrap text-default-foreground">
        {children}
      </code>
    );
  },
  em: ({ children }) => <em className="font-italic">{children}</em>,
  h1: ({ children }) => <BlogHeading level={1}>{children}</BlogHeading>,
  h2: ({ children }) => <BlogHeading level={2}>{children}</BlogHeading>,
  h3: ({ children }) => <BlogHeading level={3}>{children}</BlogHeading>,
  h4: ({ children }) => <BlogHeading level={4}>{children}</BlogHeading>,
  h5: ({ children }) => <BlogHeading level={5}>{children}</BlogHeading>,
  h6: ({ children }) => <BlogHeading level={6}>{children}</BlogHeading>,
  li: ({ children }) => <li className="mb-2">{children}</li>,
  ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal lg:mb-8">{children}</ol>,
  // eslint-disable-next-line id-length
  p: ({ children }) => <p className="mb-3 lg:mb-8">{children}</p>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  ul: ({ children }) => <ul className="mb-3 ml-5 list-disc lg:mb-8">{children}</ul>,
};

export function Post({ post }: { post: BlogPost }) {
  return (
    <>
      <Section>
        <BlogHeading level={1} className="text-justify">
          {post.title}
        </BlogHeading>

        <Image
          className="mt-4"
          src={`/assets/blog/${post.slug}/${post.image}${post.imageHash ? `?v=${post.imageHash}` : ""}`}
          priority
          width={1200}
          height={630}
          alt={post.title}
        />
      </Section>
      <Section className="text-justify">
        <MDXRemote options={mdxOptions} source={post.content} components={htmlToJsx} />
      </Section>
    </>
  );
}
