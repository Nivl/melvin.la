import { Card, CardBody, CardHeader } from '@heroui/card';
import Image from 'next/image';
import Link from 'next/link';

import { BlogPost } from '#models/blog/post';

export function PostDetails({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card isPressable className="relative flex w-full flex-none flex-col">
        <CardHeader className="relative bg-background p-0 shadow-none shadow-black/5">
          <div className="relative overflow-hidden">
            <Image
              src={`/blog/${post.slug}/${post.image}`}
              className="relative z-10 aspect-auto w-full transform rounded-t-large object-cover shadow-none shadow-black/5 !duration-300 transition-transform-opacity hover:scale-110 data-[loaded=true]:opacity-100 motion-reduce:transition-none"
              alt="Thumbnail of the article"
              priority={true}
              width={300}
              height={150}
            />
          </div>
        </CardHeader>

        <CardBody className="flex flex-col gap-2 px-4">
          <h2 className="text-small font-medium text-default-700">
            {post.title}
          </h2>
          <p className="text-small text-default-500">{post.excerpt}</p>
        </CardBody>
      </Card>
    </Link>
  );
}
