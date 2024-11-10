import { Key } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ListItem } from '#models/block';

export const List = ({
  key,
  items,
  style,
  className,
}: {
  key: Key;
  style: 'ordered' | 'unordered';
  items: ListItem[] | string[];
  className?: string;
}) => {
  const Tag = style === 'ordered' ? 'ol' : 'ul';
  const classname = `list-inside ${style === 'ordered' ? 'list-decimal' : 'list-disc'}`;

  return (
    <Tag className={twMerge(`${classname} ${className}`)}>
      {items.map((item, itemIndex) => {
        if (typeof item === 'string') {
          return (
            <li
              key={`${key}-${itemIndex}`}
              dangerouslySetInnerHTML={{ __html: item }}
            ></li>
          );
        }

        // Potentially Nested list
        return (
          <li
            key={`${key}-${itemIndex}`}
            dangerouslySetInnerHTML={{ __html: item.content }}
          >
            {item.items && (
              <List
                key={`${key}-${itemIndex}-sub`}
                style={style}
                items={item.items}
                className={className}
              />
            )}
          </li>
        );
      })}
    </Tag>
  );
};
