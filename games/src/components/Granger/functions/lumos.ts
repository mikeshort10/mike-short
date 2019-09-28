import { IBoard } from "../components/Board";

export const lumos = (board: IBoard, row: number, col: number) => {
	const { lumosPlus, lumosToggle } = this.state.abilities;
	const radius = lumosPlus && lumosToggle ? 3 : 2;

	for (let i = -radius; i <= radius; i++) {
		for (let j = -radius; j <= radius; j++) {
			const space = board[row + i][col + j];
			const [I, J] = [Math.abs(i), Math.abs(j)];
			if ((I > 1 && J > 1) || I === radius || J === radius) {
				space.darkness = true; // handle edge of darkness and corners
			} else if (I <= 1 && J <= 1) {
				space.darkness = false; // handle 8 surrounding spaces
			} else {
				space.darkness = !(lumosPlus && lumosToggle); // handle toggleable spaces
			}
		}
	}

	return board;
};
