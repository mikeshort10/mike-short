import { IBoard } from "../types/index";

export const luminate = (
	playerRow: number,
	playerCol: number,
	board: IBoard,
) => (row: number, column: number) => {
	[row, column] = [playerRow + row, playerCol + column];
	board[row][column].darkness = !board[row][column].darkness;
};
