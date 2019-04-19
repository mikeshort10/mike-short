import { boardIndex } from "boardSetup";

export const lumos = function(board, index) {
	const { lumosPlus, lumosToggle } = this.state.abilities;
	const shouldIlluminate = lumosPlus && lumosToggle;
	const radius = shouldIlluminate ? 3 : 2;

	for (let i = -radius; i <= radius; i++) {
		for (let j = -radius; j <= radius; j++) {
			const adjIndex = index + i * boardIndex(1, 0) + j;
			const [I, J] = [Math.abs(i), Math.abs(j)];
			if ((I > 1 && J > 1) || I === radius || J === radius) {
				board[adjIndex] = { ...board[adjIndex], darkness: true }; // handle edge of darkness and corners
			} else if (I <= 1 && J <= 1) {
				board[adjIndex] = { ...board[adjIndex], darkness: false }; // handle 8 surrounding spaces
			} else {
				board[adjIndex] = {
					...board[adjIndex],
					darkness: !shouldIlluminate,
				}; // handle toggleable spaces
			}
		}
	}
	return board;
};
