import { Post } from '#backend/types';
import { PostPreview } from '#components/blog/PostPreview';

export const ListPostPreviews = ({
  posts,
  isAdmin = false,
}: {
  posts: Post[];
  isAdmin?: boolean;
}) => {
  return (
    <div className="my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {posts.map(post => (
        <PostPreview key={post.id} post={post} isAdmin={isAdmin} />
      ))}
    </div>
  );
};
