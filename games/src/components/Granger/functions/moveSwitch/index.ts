export const moveSwitch = function(code: number, row: number, column: number) {
	const howToMove = {
		37: [row, column - 1],
		38: [row - 1, column],
		39: [row, column + 1],
		40: [row + 1, column],
	};
	return howToMove[code] || [row, column];
};
