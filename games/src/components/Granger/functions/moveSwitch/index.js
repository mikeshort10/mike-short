import { boardIndex } from "../boardSetup";

export const moveSwitch = function(code, index) {
	const boardSideLength = boardIndex(1, 0);
	const row = Math.floor(index / boardSideLength);
	const column = index % boardSideLength;
	switch (code) {
		case 37:
			return boardIndex(row, column - 1);
		case 38:
			return boardIndex(row - 1, column);
		case 39:
			return boardIndex(row, column + 1);
		case 40:
			return boardIndex(row + 1, column);
		default:
			return index;
	}
};
