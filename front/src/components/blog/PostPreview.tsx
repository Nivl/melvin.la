import { Card, CardBody } from '@heroui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { BlogPost } from '#backend/api';

export const PostPreview = ({
  post,
  isAdmin = false,
}: {
  post: BlogPost;
  isAdmin?: boolean;
}) => {
  const router = useRouter();

  return (
    <Card
      isPressable
      className="relative flex w-full flex-none flex-col gap-3"
      onPress={() => {
        router.push(
          isAdmin ? `/admin/blog/posts/${post.id}` : `/blog/${post.slug}`,
        );
      }}
    >
      <CardBody className="relative rounded-large bg-background p-0 shadow-none shadow-black/5">
        <div className="rounded-inherit relative overflow-hidden rounded-large">
          <Image
            src={post.thumbnailUrl ?? 'https://placehold.co/400.png'}
            className="relative z-10 aspect-square w-full transform rounded-large object-cover shadow-none shadow-black/5 !duration-300 transition-transform-opacity hover:scale-110 data-[loaded=true]:opacity-100 motion-reduce:transition-none"
            alt="Thumbnail of the article"
            width={400}
            height={400}
          />
        </div>

        <div className="mt-1 flex flex-col gap-2 px-1 pt-3">
          <h3 className="text-small font-medium text-default-700">
            {post.title}
          </h3>
          <p className="text-small text-default-500">{post.description}</p>
        </div>
      </CardBody>
    </Card>
  );
};
