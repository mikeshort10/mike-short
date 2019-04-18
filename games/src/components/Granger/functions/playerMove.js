import { moveSwitch } from "./moveSwitch/moveSwitch";

export const playerMove = function(code) {
	if (typeof code !== "number") code = window.event.keyCode;
	if ((code < 37 || code > 40) && code !== 65) return;
	let board = { ...this.state.board };
	let player = { ...this.state.player };
	let enemies = { ...this.state.enemies };
	let abilities = { ...this.state.abilities };
	let boss = { ...this.state.boss };
	const { playerDirection, checkpointCodes, attacking } = this.state;
	let { XP, HP, maxHP, level } = player;
	let modal = 0;
	let [nextRow, nextCol] = moveSwitch(
		code !== 65 ? code : playerDirection,
		...player.position,
	);
	const nextSpace = board[nextRow][nextCol];
	if (
		nextSpace.player === "hufflepuff" ||
		nextSpace.player === "ravenclaw" ||
		nextSpace.player === "slytherin" ||
		nextSpace.player === "boss"
	) {
		let key,
			attack = Math.floor(
				Math.random() * player.randomLimit + player.baseAttack,
			);
		if (nextSpace.player === "boss") {
			boss.HP -= attack;
		} else {
			for (key in enemies) {
				let e = enemies[key].position;
				if (e[0] === nextRow && e[1] === nextCol) {
					enemies[key].attack = true;
					break;
				}
			}
			enemies[key].HP -= attack;
			if (enemies[key].HP <= 0) {
				const newVillian =
					enemies[key].player === "hufflepuff"
						? "ravenclaw"
						: "slytherin";
				enemies[key] = this.generateVillian(
					checkpointCodes,
					board,
					newVillian,
				);
				XP += enemies[key].playerXP;
				delete nextSpace.player;
				nextSpace.playable = true;
			}
		}
	} else if (code !== 65 && nextSpace.playable) {
		let lastSpace = board[player.position[0]][player.position[1]];
		[
			player.lastCheckpoint,
			player.checkpointCode,
		] = this.determineCheckpoint(player, lastSpace, nextSpace);
		delete lastSpace.player;
		if (nextSpace.row === 23 && nextSpace.column === 47) {
			// if you make it into the boss's lair, the door shuts behind you and all other players stop moving
			board[23][46].playable = false;
			boss.timer = setInterval(this.bossMove, 2000);
			clearInterval(this.state.timer.id);
		}
		if (nextSpace.player === "wand") {
			XP += 10;
		} else if (nextSpace.player === "potion") {
			HP = Math.min(maxHP, HP + 10);
			this.randomSpace(board, nextSpace.player, 1);
		} else if (nextSpace.player === "book") {
			modal = 3;
			abilities.alohomora = true;
			board = this.alohomora(board);
		}
		if ((level + 1) * 10 <= XP) {
			XP -= ++level * 10;
			maxHP += 10;
			HP += 10;
			player.baseAttack += 2;
			if (level === 3) {
				modal = 1;
				abilities = { ...abilities, hasCloak: true, cloaked: true };
			} else if (level === 5) {
				modal = 2;
				abilities.lumosPlus = true;
			}
		}
		nextSpace.player = "player";
		board = this.lumos(board, nextRow, nextCol);
		player.position = [nextRow, nextCol];
	}
	// if (code === playerDirection) setTimeout(() => this.playerMove(code), 100);
	this.setState(
		{
			modal,
			board,
			boss,
			enemies,
			abilities,
			player: { ...player, XP, HP, maxHP, level },
			playerDirection: code === 65 ? playerDirection : code,
			attacking: code === 65 ? true : attacking,
		},
		this.win,
	);
};
