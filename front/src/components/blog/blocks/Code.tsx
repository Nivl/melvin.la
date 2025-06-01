import { useTheme } from 'next-themes';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import {
  materialLight as LightTheme,
  oneDark as DarkTheme,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { twMerge } from 'tailwind-merge';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('bash', bash);

export const Code = ({
  code,
  language,
  showlinenumbers,
  className,
}: {
  code: string;
  language: string;
  showlinenumbers: boolean;
  className?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers={showlinenumbers}
      showInlineLineNumbers={showlinenumbers}
      style={theme}
      className={twMerge(`!rounded-lg !text-base ${className ?? ''}`)}
    >
      {code}
    </SyntaxHighlighter>
  );
};
