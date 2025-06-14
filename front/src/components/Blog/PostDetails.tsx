import { BlogPost } from '#models/blog/post';

export function PostDetails({ post }: { post: BlogPost }) {
  return (
    <article className="prose mx-auto">
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
    </article>
  );
}
