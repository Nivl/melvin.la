export type BoardValue = 0 | 1;
export type Board = BoardValue[][];
export const boardSizes = [25, 28, 35, 50, 70, 100];

export * from './default';
export * from './glider';
export * from './heavyweight';
export * from './pentadecathlon';
export * from './pulsar';
