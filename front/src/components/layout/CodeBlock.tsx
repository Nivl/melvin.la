'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import {
  materialLight as LightTheme,
  oneDark as DarkTheme,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { twMerge } from 'tailwind-merge';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);

export const CodeBlock = ({
  children,
  language,
  showlinenumbers,
  className,
}: {
  children: string;
  language?: string;
  showlinenumbers: boolean;
  className?: string;
}) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Prevents hydration mismatch by ensuring the component is only rendered
  // after the theme is resolved.
  // Not doing so results in a mismatch between this component's theme
  // and the user's theme (white codeblock in dark mode).
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const theme = resolvedTheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers={showlinenumbers}
      showInlineLineNumbers={showlinenumbers}
      style={theme}
      className={twMerge(
        `!rounded-lg !font-monospace !text-base ${className ?? ''}`,
      )}
      codeTagProps={{
        style: {
          fontFamily: 'var(--font-monospace)',
        },
      }}
    >
      {children.replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};
