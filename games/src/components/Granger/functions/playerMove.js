import { moveSwitch } from "./moveSwitch";
import { boardIndex } from "./boardSetup";

export const playerMove = function(code) {
	if (typeof code !== "number") code = window.event.keyCode;
	if ((code < 37 || code > 40) && code !== 65) return;
	let board = [...this.state.board];
	let enemies = [...this.state.enemies];
	let abilities = { ...this.state.abilities };
	let boss = { ...this.state.boss };
	const { playerDirection, checkpointCodes, attacking } = this.state;
	let {
		XP,
		HP,
		maxHP,
		level,
		position,
		randomLimit,
		baseAttack,
		lastCheckpoint,
		checkpointCode,
	} = this.state.player;
	let modal = 0;
	let nextIndex = moveSwitch(code !== 65 ? code : playerDirection, position);
	const nextSpace = { ...board[nextIndex] };
	const enemyNames = ["hufflepuff", "ravenclaw", "slytherin", "boss"];
	if (code === 65 && enemyNames.includes(nextSpace.player)) {
		let enemy,
			attack = Math.floor(Math.random() * randomLimit + baseAttack);
		if (nextSpace.player === "boss") {
			boss.HP -= attack;
		} else {
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].position === nextIndex) {
					enemy = { ...enemies[i], attack: true, HP: HP - attack };
					if (enemy.HP <= 0) {
						XP += enemy.playerXP;
						const newVillian =
							enemy.player === "hufflepuff"
								? "ravenclaw"
								: "slytherin";
						enemy = this.generateVillian(
							checkpointCodes,
							board,
							newVillian,
						);
						delete nextSpace.player;
						nextSpace.playable = true;
					}
					enemies[i] = enemy;
					break;
				}
			}
		}
	} else if (code !== 65 && nextSpace.playable) {
		let lastIndex = board[position];
		const bossLair = boardIndex(23, 47);
		[lastCheckpoint, checkpointCode] = this.determineCheckpoint(
			this.state.player,
			lastIndex,
			nextIndex,
		);
		delete lastIndex.player;
		if (nextIndex === bossLair) {
			// if you make it into the boss's lair, the door shuts behind you and all other players stop moving
			board[bossLair - 1].playable = false;
			boss.timer = setInterval(this.bossMove, 2000);
			clearInterval(this.state.timer.id);
		}
		if (nextIndex.player === "wand") {
			XP += 10;
		} else if (nextIndex.player === "potion") {
			HP = Math.min(maxHP, HP + 10);
			this.randomSpace(board, nextIndex.player, 1);
		} else if (nextIndex.player === "book") {
			modal = 3;
			abilities.alohomora = true;
			board = this.alohomora(board);
		}
		if ((level + 1) * 10 <= XP) {
			XP -= ++level * 10;
			maxHP += 10;
			HP += 10;
			baseAttack += 2;
			if (level === 3) {
				modal = 1;
				abilities = { ...abilities, hasCloak: true, cloaked: true };
			} else if (level === 5) {
				modal = 2;
				abilities.lumosPlus = true;
			}
		}
		board[nextIndex].player = "player";
		board = this.lumos(board, nextIndex);
		position = nextIndex;
	}
	// if (code === playerDirection) setTimeout(() => this.playerMove(code), 100);
	this.setState(
		{
			modal,
			board,
			boss,
			enemies,
			abilities,
			player: {
				...this.state.player,
				XP,
				HP,
				maxHP,
				level,
				position,
				lastCheckpoint,
				checkpointCode,
			},
			playerDirection: code === 65 ? playerDirection : code,
			attacking: code === 65 ? true : attacking,
		},
		this.win,
	);
};
