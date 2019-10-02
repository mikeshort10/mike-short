import { IBoard, PlayerType } from "../types";
import { map } from "lodash";
import { SpaceProps } from "../components/Board";

export const randomize = (multiplier: number, constant: number = 0) => {
	const randomDecimal = Math.random() * multiplier + constant;
	return Math.floor(randomDecimal);
};

export const randomSpace = (
	board: IBoard,
	player: PlayerType,
	num: number,
): IBoard => {
	board = map(board, col => ({ ...col }));
	for (let i = 0; i < num; i++) {
		let row: number;
		let column: number;
		let space: SpaceProps;
		do {
			row = randomize(50);
			column = randomize(50);
			space = board[row][column];
		} while (
			!space.playable ||
			space.player ||
			(row > 20 && row < 32) ||
			(column > 20 && column < 32)
		);
		space.player = player;
	}
	return board;
};
