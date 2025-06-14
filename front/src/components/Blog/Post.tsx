import { MDXRemote } from 'next-mdx-remote/rsc';

export function Post({ content }: { content: string }) {
  return (
    <article className="prose mx-auto">
      <MDXRemote source={content} components={{}} />
    </article>
  );
}
