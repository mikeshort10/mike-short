export const moveSwitch = function(code, rowToChange, columnToChange) {
	switch (code) {
		case 37:
			return [rowToChange, columnToChange - 1];
		case 38:
			return [rowToChange - 1, columnToChange];
		case 39:
			return [rowToChange, columnToChange + 1];
		case 40:
			return [rowToChange + 1, columnToChange];
		default:
			return [rowToChange, columnToChange];
	}
};
