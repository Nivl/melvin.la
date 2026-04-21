import { Link } from "@heroui/react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { isValidElement } from "react";

import { BlogHeading } from "#features/blog/components/blog-heading";
import { BlogPost } from "#features/blog/models.ts";
import { Link as NextLink } from "#i18n/routing";
import { CodeBlock } from "#shared/components/layout/code-block";
import { Section } from "#shared/components/layout/section";

export const Post = ({ post }: { post: BlogPost }) => (
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
      <MDXRemote
        options={{ blockJS: false }}
        source={post.content}
        components={{
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
                  className="text-nivl underline"
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
              <NextLink className="link text-nivl underline" href={href}>
                {children}
              </NextLink>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-nivl pl-4 italic">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="inline-block h-fit rounded-lg bg-default/70 px-2 py-1 font-monospace text-sm font-normal whitespace-nowrap text-default-foreground">
              {children}
            </code>
          ),
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
          pre: ({ children }: { children?: React.ReactNode }) => {
            if (
              children === undefined ||
              !isValidElement<{ className?: string; children?: ReactNode }>(children)
            ) {
              return undefined;
            }

            const elementType =
              typeof children.type === "string" ? children.type : children.type.name;

            if (elementType !== "code") {
              return <pre>{children}</pre>;
            }

            const childrenProps = children.props;

            const match =
              "className" in childrenProps
                ? /language-(\w+)/.exec(childrenProps.className ?? "")
                : "";
            const hasAMatch = match !== null && match.length > 0;

            if (
              childrenProps.children === undefined ||
              typeof childrenProps.children !== "string" ||
              // we use "hidden" to keep track of the
              // source code of the mermaid graphs
              // We don't want to render it as a code block
              (hasAMatch && match[1] === "hidden")
            ) {
              return undefined;
            }

            return (
              <div className="mb-8">
                <CodeBlock language={hasAMatch ? match[1] : undefined} showlinenumbers>
                  {childrenProps.children}
                </CodeBlock>
              </div>
            );
          },
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          ul: ({ children }) => <ul className="mb-3 ml-5 list-disc lg:mb-8">{children}</ul>,
        }}
      />
    </Section>
  </>
);
