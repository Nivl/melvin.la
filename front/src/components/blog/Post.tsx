import { Code } from '@heroui/react';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { isValidElement } from 'react';

import { CodeBlock } from '#components/layout/CodeBlock';
import { Heading } from '#components/layout/Heading';
import { Section } from '#components/layout/Section';
import { BlogPost } from '#models/blog/post';

export function Post({ post }: { post: BlogPost }) {
  return (
    <>
      <Section>
        <Heading level={1} className="text-justify">
          {post.title}
        </Heading>

        <Image
          className="mt-4"
          src={`/blog/${post.slug}/${post.image}`}
          priority={true}
          width={1200}
          height={600}
          alt={post.title}
        />
      </Section>
      <Section className="text-justify">
        <MDXRemote
          source={post.content}
          components={{
            h1: ({ children }) => <Heading level={1}>{children}</Heading>,
            h2: ({ children }) => <Heading level={2}>{children}</Heading>,
            h3: ({ children }) => <Heading level={3}>{children}</Heading>,
            h4: ({ children }) => <Heading level={4}>{children}</Heading>,
            h5: ({ children }) => <Heading level={5}>{children}</Heading>,
            h6: ({ children }) => <Heading level={6}>{children}</Heading>,
            p: ({ children }) => <p className="mb-3 lg:mb-8">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-3 ml-5 list-disc lg:mb-8">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 ml-5 list-decimal lg:mb-8">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-2">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-bold">{children}</strong>
            ),
            em: ({ children }) => <em className="font-italic">{children}</em>,
            code: ({ children }) => (
              <Code color="default" className="font-monospace">
                {children}
              </Code>
            ),
            Image,
            pre: ({ children }: { children?: React.ReactNode }) => {
              if (!children || !isValidElement(children)) {
                return <></>;
              }

              const elementType =
                typeof children.type === 'string'
                  ? children.type
                  : children.type.name;

              if (elementType !== 'code') {
                return <pre>{children}</pre>;
              }

              const childrenProps = children.props as {
                className?: string;
                children: React.ReactNode;
              };

              const match =
                'className' in childrenProps
                  ? /language-(\w+)/.exec(childrenProps.className ?? '')
                  : '';

              if (
                !childrenProps.children ||
                typeof childrenProps.children !== 'string' ||
                // we use "hidden" to keep track of the
                // source code of the mermaid graphs
                // We don't want to render it as a code block
                (match && match[1] === 'hidden')
              ) {
                return <></>;
              }

              return (
                <div className="mb-8">
                  <CodeBlock
                    language={match ? match[1] : undefined}
                    showlinenumbers={true}
                  >
                    {childrenProps.children}
                  </CodeBlock>
                </div>
              );
            },
          }}
        />
      </Section>
    </>
  );
}
