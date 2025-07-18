import { Card, CardBody, CardHeader } from '@heroui/card';
import Image from 'next/image';
import Link from 'next/link';

import { BlogPost } from '#models/blog/post';

export function PostDetails({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        isPressable
        className="relative flex h-full w-full flex-none flex-col"
      >
        <CardHeader className="bg-background relative p-0 shadow-none shadow-black/5">
          <div className="relative overflow-hidden">
            <Image
              src={`/assets/blog/${post.slug}/${post.image}`}
              className="rounded-t-large transition-transform-opacity relative z-10 aspect-auto w-full transform object-cover shadow-none shadow-black/5 duration-300! hover:scale-110 data-[loaded=true]:opacity-100 motion-reduce:transition-none"
              alt="Thumbnail of the article"
              priority={true}
              width={300}
              height={150}
            />
          </div>
        </CardHeader>

        <CardBody className="flex flex-col gap-2 px-4">
          <h2 className="text-small text-default-700 font-medium">
            {post.title}
          </h2>
          <p className="text-small text-default-500">{post.excerpt}</p>
        </CardBody>
      </Card>
    </Link>
  );
}
