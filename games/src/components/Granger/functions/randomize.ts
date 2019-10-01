export function randomize(multiplier: number, constant: number = 0) {
	const randomDecimal = Math.random() * multiplier + constant;
	return Math.floor(randomDecimal);
}

export default randomize;
