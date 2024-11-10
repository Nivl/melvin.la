'use client';

import dynamic from 'next/dynamic';
import { forwardRef, memo } from 'react';

import {
  EditorRef,
  Props as RawEditorProps,
} from '#components/Admin/blog/EditorJSWrapper';

export type Props = Omit<RawEditorProps, 'editorRef'>;

const EditorJSWrapper = dynamic(
  () =>
    import('#components/Admin/blog/EditorJSWrapper').then(
      mod => mod.EditorJSWrapper,
    ),
  {
    ssr: false,
    suspense: true,
  },
);

export const Editor = memo(
  forwardRef((props: Props, ref: EditorRef) => (
    <EditorJSWrapper {...props} editorRef={ref} />
  )),
);

Editor.displayName = 'Editor';
