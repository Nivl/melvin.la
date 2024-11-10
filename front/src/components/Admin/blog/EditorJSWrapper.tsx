'use client';

import editorjsCodecup from '@calumk/editorjs-codecup';
import Delimiter from '@editorjs/delimiter';
import { OutputData } from '@editorjs/editorjs';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import { Ref, useEffect, useImperativeHandle, useRef } from 'react';

export type EditorRef = Ref<EditorJS>;

export type Props = {
  initialData: OutputData | undefined;
  editorblock: string | undefined;
  editorRef: Ref<EditorJS>;
};

export const EditorJSWrapper = (
  { initialData, editorblock, editorRef }: Props,
  // forwardedRef: Ref<EditorJS>,
) => {
  const ref = useRef<EditorJS>();
  useImperativeHandle(editorRef, () => ref.current as EditorJS);

  //Initialize editorjs
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,
        inlineToolbar: true,
        tools: {
          list: List,
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
            toolbox: [
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10 19 9.5 19 12C19 13.9771 16.0684 13.9997 16.0012 16.8981C15.9999 16.9533 16.0448 17 16.1 17L19.3 17"/></svg>',
                title: 'Heading 2',
                data: {
                  level: 2,
                },
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10.5 16.8323 10 17.6 10C18.3677 10 19.5 10.311 19.5 11.5C19.5 12.5315 18.7474 12.9022 18.548 12.9823C18.5378 12.9864 18.5395 13.0047 18.5503 13.0063C18.8115 13.0456 20 13.3065 20 14.8C20 16 19.5 17 17.8 17C17.8 17 16 17 16 16.3"/></svg>',
                title: 'Heading 3',
                data: {
                  level: 3,
                },
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 10L15.2834 14.8511C15.246 14.9178 15.294 15 15.3704 15C16.8489 15 18.7561 15 20.2 15M19 17C19 15.7187 19 14.8813 19 13.6"/></svg>',
                title: 'Heading 4',
                data: {
                  level: 4,
                },
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 15.9C16 15.9 16.3768 17 17.8 17C19.5 17 20 15.6199 20 14.7C20 12.7323 17.6745 12.0486 16.1635 12.9894C16.094 13.0327 16 12.9846 16 12.9027V10.1C16 10.0448 16.0448 10 16.1 10H19.8"/></svg>',
                title: 'Heading 5',
                data: {
                  level: 5,
                },
              },
              {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19.5 10C16.5 10.5 16 13.3285 16 15M16 15V15C16 16.1046 16.8954 17 18 17H18.3246C19.3251 17 20.3191 16.3492 20.2522 15.3509C20.0612 12.4958 16 12.6611 16 15Z"/></svg>',
                title: 'Heading 6',
                data: {
                  level: 6,
                },
              },
            ],
          },
          delimiter: Delimiter,
          quote: Quote,
          code: {
            class: editorjsCodecup,
            toolbox: [
              {
                icon: '<svg class="ce-popover-item__icon__codeblock" viewBox="0 0 512 512"><path strokeWidth="32" d="M161.98 397.63 0 256l161.98-141.63 27.65 31.61L64 256l125.63 110.02-27.65 31.61zm188.04 0-27.65-31.61L448 256 322.37 145.98l27.65-31.61L512 256 350.02 397.63zM222.15 442 182 430.08 289.85 70 330 81.92 222.15 442z" /></svg>',
                title: 'Code Block',
                data: {
                  level: 2,
                },
              },
            ],
          },
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+M',
            inlineToolbar: true,
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              withHeadings: true,
            },
          },
          image: ImageTool,
        },
        data: initialData,
      });
      ref.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };

    // We don't want any side effects, this needs to run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={editorblock} />;
};
