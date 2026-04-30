import { Card } from "@heroui/react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { BlogPost } from "#features/blog/models.ts";
import { Link } from "#i18n/routing";

export const PostDetails = ({ post }: { post: BlogPost }) => {
  const t = useTranslations("blog");

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full w-full p-0">
        <div className="overflow-hidden">
          <Image
            src={`/assets/blog/${post.slug}/${post.image}${post.imageHash ? `?v=${post.imageHash}` : ""}`}
            className="aspect-auto w-full object-cover transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
            alt={t("defaultThumbnailAlt")}
            width={1200}
            height={630}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <Card.Header className="px-4 pb-4">
          <Card.Title>{post.title}</Card.Title>
          <Card.Description>{post.excerpt}</Card.Description>
        </Card.Header>
      </Card>
    </Link>
  );
};
