import { PostDetails } from '#components/blog/PostDetails';
import { Heading } from '#components/layout/Heading';
import { Section } from '#components/layout/Section';
import { BlogPost } from '#models/blog/post';

export function List({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <Section>
        <Heading level={1}>Blog Posts</Heading>
      </Section>
      <Section>
        <div className="my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostDetails key={post.slug} post={post} />
          ))}
        </div>
      </Section>
    </>
  );
}
