import { IBoard } from "../components/Board";

const { obstacles } = require("./../JSON/obstacles.json");

export function boardSetup() {
	const board: IBoard = {};
	const enemies = {};
	for (let i = 0; i < 54; i++) {
		board[i] = {};
		for (let j = 0; j < 54; j++) {
			board[i][j] = {
				player: undefined,
				playable: obstacles[i] !== undefined,
				darkness: !this.state.testMode,
			};
		}
	}
	board[36][48].player = "book";
	board[23][46].player = "door";
	board[28][28].player = "player";
	const player = {
		position: [28, 28],
		lastCheckpoint: [23, 33],
		checkpointCode: "1",
		baseAttack: 6,
		randomLimit: 4,
		level: 1,
		HP: 30,
		maxHP: 30,
		XP: 0,
		attack: "Stupify",
	};
	this.lumos(board, 28, 28);
	const checkpointCodes = this.generateCheckpoints(board);
	this.randomSpace(board, "wand", 12);
	this.randomSpace(board, "potion", 6);
	const boss = this.generateVillian(checkpointCodes, board, "boss");
	for (let i = 0; i < this.state.numOfEnemies; i++) {
		enemies[i] = this.generateVillian(
			checkpointCodes,
			board,
			this.state.enemyType,
		);
	}
	this.setState({
		board,
		boss,
		enemies,
		checkpointCodes,
		player,
		timer: {
			count: 500,
			id: setInterval(this.moveEnemies, 500),
		},
	});
}
