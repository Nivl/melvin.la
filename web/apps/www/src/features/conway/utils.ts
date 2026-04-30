import { Board } from "#features/conway/models";

export const totalNeighbors = (board: Board, x: number, y: number, toroidal: boolean): number => {
  const size = board.length;
  let total = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dy === 0 && dx === 0) {
        continue;
      }
      if (toroidal) {
        const ny = (y + dy + size) % size;
        const nx = (x + dx + size) % size;
        total += board[ny]?.[nx] ?? 0;
      } else {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
          total += board[ny]?.[nx] ?? 0;
        }
      }
    }
  }
  return total;
};
