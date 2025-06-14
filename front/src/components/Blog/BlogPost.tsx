import { MDXRemote } from 'next-mdx-remote/rsc';

type BlogPostProps = {
  content: string;
};

export function BlogPost({ content }: BlogPostProps) {
  return (
    <article className="prose mx-auto">
      <MDXRemote source={content} components={{}} />
    </article>
  );
}
