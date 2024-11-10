export type Header = {
  id: string;
  type: 'header';
  data: {
    text: string;
    level: number;
  };
};

export type Paragraph = {
  id: string;
  type: 'paragraph';
  data: {
    text: string;
  };
};

export type Delimiter = {
  id: string;
  type: 'delimiter';
};

export type List = {
  id: string;
  type: 'list';
  data: {
    style: 'ordered' | 'unordered';
    items: ListItem[] | string[];
  };
};

export type ListItem = {
  content: string;
  items: ListItem[] | string[];
};

export type Image = {
  id: string;
  type: 'image';
  data: {
    file: {
      url: string;
    };
    caption: string;
  };
};

export type Quote = {
  id: string;
  type: 'quote';
  data: {
    text: string;
    caption: string;
    alignment: 'left' | 'right';
  };
};

export type Table = {
  id: string;
  type: 'table';
  data: {
    withHeadings: boolean;
    stretched: boolean;
    content: string[][];
  };
};

export type Code = {
  id: string;
  type: 'code';
  data: {
    code: string;
    language: string;
    showCopyButton: boolean;
    showlinenumbers: boolean;
  };
};

export type Block =
  | Header
  | Paragraph
  | List
  | Delimiter
  | Image
  | Quote
  | Table
  | Code;
