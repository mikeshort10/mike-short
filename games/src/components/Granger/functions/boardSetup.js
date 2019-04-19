const { obstacles } = require("./../JSON/obstacles.json");

export function moveEnemies() {
	if (this.state.status !== "play") return null;
	const { board, player, enemies, timer } = { ...this.state };
	const moveHuffs = Number.isInteger(timer.count / 3);
	const moveRavs = Number.isInteger(timer.count++ / 2);
	for (let key in enemies) {
		const house = enemies[key].player;
		if (
			house === "slytherin" ||
			(moveRavs && house === "ravenclaw") ||
			(moveHuffs && house === "hufflepuff")
		) {
			this.enemyMove(key, board, player, enemies);
		}
	}
	this.setState({ board, enemies, player, timer }, this.win);
}

export function boardSetup() {
	const board = {};
	const enemies = {};
	for (let i = 0; i < 54; i++) {
		board[i] = {};
		for (let j = 0; j < 54; j++) {
			board[i][j] = {
				row: i,
				column: j,
				playable: true,
				darkness: !this.state.testMode,
			};
		}
	}
	obstacles.map((x, i) =>
		obstacles[i].map(y => (board[i][y].playable = false)),
	);
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
		abilities: {
			cloaked: false,
			lumosPlus: false,
			elderWand: false,
			lumosToggle: false,
			alohomora: false,
		},
		timer: {
			count: 500,
			id: setInterval(this.moveEnemies, 500),
		},
	});
}
