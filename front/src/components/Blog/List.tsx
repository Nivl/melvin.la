import { BlogPost } from '#models/blog/post';

export function List({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      {posts.map(post => (
        <article key={post.id} className="prose mx-auto">
          <PostDetails post={post} />
        </article>
      ))}
    </>
  );
}
