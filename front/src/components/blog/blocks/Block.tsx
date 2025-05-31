'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { Key } from 'react';

import type { Block as BlockData } from '#models/block';

import { Code } from './Code';
import { Heading } from './Heading';
import { List } from './List';
import { Quote } from './Quote';

export const Block = ({ block, key }: { block: BlockData; key: Key }) => {
  switch (block.type) {
    case 'header':
      return <Heading level={block.data.level}>{block.data.text}</Heading>;
    case 'paragraph':
      return (
        <p
          className="mb-3"
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        ></p>
      );
    case 'list':
      return (
        <List
          className="mb-3"
          key={`${key}-list-${block.id}`}
          items={block.data.items}
          style={block.data.style}
        />
      );
    case 'table':
      return (
        <Table className="mb-3">
          <TableHeader>
            {block.data.content[0].map((col, itemIndex) => {
              return (
                <TableColumn key={`${key}-table-${block.id}-0-${itemIndex}`}>
                  {col}
                </TableColumn>
              );
            })}
          </TableHeader>
          <TableBody>
            {block.data.content.slice(1).map((rows, rowIndex) => {
              return (
                <TableRow key={`${key}-table-${block.id}-${rowIndex}`}>
                  {block.data.content[0].map((col, colIndex) => {
                    return (
                      <TableCell
                        key={`${key}-table-${block.id}-${rowIndex}-${colIndex}`}
                      >
                        {col}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    case 'code':
      return (
        <Code
          className="!mb-3"
          code={block.data.code}
          language={block.data.language}
          showlinenumbers={block.data.showlinenumbers}
        />
      );
    case 'quote':
      return (
        <Quote
          className="!mb-3"
          quote={block.data.text}
          author={block.data.caption}
        />
      );
    default:
      console.log('unknown block', block);
  }
};
