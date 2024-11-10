import { Post } from '#components/blog/Post';

export default function Home({ params }: { params: { slug: string } }) {
  return <Post slug={params.slug} />;
}
