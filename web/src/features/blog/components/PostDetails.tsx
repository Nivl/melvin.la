import { Card } from "@heroui/react";
import Image from "next/image";

import { BlogPost } from "#features/blog/models.ts";
import { Link } from "#i18n/routing";

export function PostDetails({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full w-full p-0">
        <div className="overflow-hidden">
          <Image
            src={`/assets/blog/${post.slug}/${post.image}`}
            className="aspect-auto w-full object-cover transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
            alt="Thumbnail of the article"
            priority={true}
            width={1200}
            height={630}
          />
        </div>

        <Card.Header className="px-4 pb-4">
          <Card.Title>{post.title}</Card.Title>
          <Card.Description>{post.excerpt}</Card.Description>
        </Card.Header>
      </Card>
    </Link>
  );
}
