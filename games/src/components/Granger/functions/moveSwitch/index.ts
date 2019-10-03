import { has } from "lodash";
import { DirectionKeys } from "../../types";

export const directionKeys: DirectionKeys = {
	37: true,
	38: true,
	39: true,
	40: true,
};

export const acceptableKeys = { ...directionKeys, 65: true };

interface IObjectWithNumberKeys<T> {
	[x: number]: T;
}

export const moveSwitch = (
	row: number,
	column: number,
	code?: number,
): number[] => {
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
