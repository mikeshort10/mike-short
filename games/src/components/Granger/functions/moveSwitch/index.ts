import { directionKeys } from "../..";
import { has } from "lodash";

interface IObjectWithNumberKeys<T> {
	[x: number]: T;
}

export const moveSwitch = function(row: number, column: number, code?: number) {
	const howToMove: IObjectWithNumberKeys<number[]> = {
		37: [row, column - 1],
		38: [row - 1, column],
		39: [row, column + 1],
		40: [row + 1, column],
	};
	if (code && has(directionKeys, code)) {
		return howToMove[code];
	}
	return [row, column];
};
