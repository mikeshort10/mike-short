import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Stats } from "./Stats";
import Board from "./Board";
import { partial, map, has, findIndex, keys, forEach } from "lodash";
import { modalText } from "../JSON/modalText.json";
import { IGrangerState, enemyClasses } from "..";
import { Player } from "../classes/Player";
import { IBoard, ICheckpoint, EnemyHouse, IDefaultEnemyProps } from "../types";
import { Boss } from "../classes/Boss";
import { IEnemies, Enemy } from "../classes/Enemy";
import { randomize, randomSpace } from "../functions/randomize";
import {
	moveSwitch,
	acceptableKeys,
	directionKeys,
} from "../functions/moveSwitch";
import {
	findCheckpoint,
	indexes,
	determineCheckpoint,
} from "../functions/checkpoints";
import { checkpoints } from "../JSON/checkpoints.json";
import { luminate } from "../functions/luminate";

export interface IPlayProps {
	modal: number;
	changeState(key: keyof IGrangerState, value: any): void;
	board: IBoard;
	numOfEnemies: number;
	// status: "begin" | "instructions" | "play" | "select" | "lose" | "win";
	enemyType: "hufflepuff" | "ravenclaw" | "slytherin";
	testMode: boolean;
}

interface IPlayState {
	attacking: boolean;
	player: Player;
	boss: Enemy;
	board: IBoard;
	enemies: IEnemies;
}

let timer: NodeJS.Timeout;
let timerCount: number = 0;
const timerDuration = 500;
let checkpointCodes: string[];

const defaultEnemyProps: IDefaultEnemyProps = {
	hufflepuff: { HP: 20, XP: 15, baseAttack: 6 },
	ravenclaw: { HP: 30, XP: 20, baseAttack: 10 },
	slytherin: { HP: 50, XP: 35, baseAttack: 15 },
};

export class Play extends React.Component<IPlayProps, IPlayState> {
	constructor(props: IPlayProps) {
		super(props);
		const { board, numOfEnemies } = this.props;
		this.state = {
			attacking: false,
			board,
			enemies: {},
			boss: new Boss({
				board,
				baseAttack: numOfEnemies,
				HP: numOfEnemies * 9,
			}),
			player: new Player(),
		};
	}

	enemyMove = (enemy: Enemy) => {
		let board = { ...this.state.board };
		let lindsay = { ...this.state.player };
		let newRow: number,
			newCol: number,
			destination,
			destinationCode = "";
		let [row, column] = ([newRow, newCol] = enemy.getPosition());
		const {
			attack,
			lastCheckpoint,
			baseAttack,
			checkpointCode,
			type,
		} = enemy;
		if (!attack) {
			const code = randomize(4, 37);
			[newRow, newCol] = moveSwitch(row, column, code);
			const { playable, player } = board[newRow][newCol];
			if (!playable || player === "book") {
				[newRow, newCol] = [row, column];
			}
		} else {
			const [pCC, eCC] = [lindsay.checkpointCode, checkpointCode];
			if (pCC === eCC) {
				destination = lindsay.getPosition();
				destinationCode = pCC;
			} else {
				let i = 0;
				while (eCC[i] && pCC[i] === eCC[i]) {
					destinationCode += eCC[i++];
				}
				if (row === lastCheckpoint[0] && column === lastCheckpoint[1]) {
					if (destinationCode === eCC || destinationCode === "") {
						destinationCode += pCC[i];
					} else {
						destinationCode = destinationCode.slice(
							0,
							destinationCode.length - 1,
						);
					}
				}
				if (destinationCode === "") {
					destinationCode = pCC[0];
				}
				destination = findCheckpoint(
					destinationCode,
					true,
					checkpoints,
				);
				console.log("reset isToCenter");
			}
			enemy.lastCheckpoint = destination;
			enemy.checkpointCode = destinationCode;
			const [rDiff, cDiff] = [
				row - destination[0],
				column - destination[1],
			];
			const upDown = rDiff / Math.abs(rDiff ? rDiff : 1);
			const leftRight = cDiff / Math.abs(cDiff ? cDiff : 1);
			const spaceX = board[row][column - leftRight];
			const spaceY = board[row - upDown][column];
			const altSpaceX = board[row][column + leftRight];
			const altSpaceY = board[row + upDown][column];
			if (Math.abs(rDiff) >= Math.abs(cDiff) && rDiff !== 0) {
				if (spaceY.playable) {
					newRow -= upDown;
				} else if (spaceX && spaceX.playable) {
					newCol -= leftRight;
				} else if (altSpaceX && altSpaceX.playable) {
					newCol += leftRight;
				}
			} else {
				if (spaceX.playable) {
					newCol -= leftRight;
				} else if (spaceY && spaceY.playable) {
					newRow -= upDown;
				} else if (altSpaceY && altSpaceY.playable) {
					newRow += upDown;
				}
			}
		}
		const newEnemy = board[newRow][newCol];
		const oldEnemy = board[row][column];
		const { player, darkness } = newEnemy;
		if (player === "player") {
			if (attack) {
				let damage = Math.ceil(Math.random() * 4 + baseAttack);
				lindsay.HP -= Math.max(lindsay.HP - damage, 0);
			}
			enemy.attack = true;
		} else {
			if (player === "wand" || player === "potion") {
				randomSpace(board, player, 1);
			}
			delete oldEnemy.player;
			oldEnemy.playable = true;
			newEnemy.player = type;
			newEnemy.playable = false;
			enemy.setPosition(newRow, newCol);
			if (!(darkness && lindsay.cloaked && this.props.testMode)) {
				enemy.attack = true;
			}
		}
	};

	lumos = (board: IBoard, row: number, col: number) => {
		const state = this.state;
		let lumosPlus: boolean = state ? state.player.lumosPlus : false;
		let lumosToggle: boolean = state ? state.player.lumosToggle : false;
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

	generateVillian = (type: EnemyHouse): Enemy => {
		if (!checkpointCodes) {
			this.generateCheckpoints();
		}
		let board = { ...this.state.board };
		let index: number;
		let code: string;
		do {
			index = randomize(checkpointCodes.length);
			code = checkpointCodes[index];
		} while (code.length < 2 || index === checkpointCodes.length - 1);
		const cp = findCheckpoint(code, true, checkpoints);
		console.log(cp);
		if (cp) {
			const [row, column] = cp;
			board[row][column].player = type;
			board[row][column].playable = false;
			return new Enemy({
				...defaultEnemyProps[type],
				board,
				type,
				row,
				column,
			});
		}
	};

	playerMove = (code: keyof typeof acceptableKeys | KeyboardEvent) => {
		if (typeof code !== "number" && has(acceptableKeys, code.keyCode)) {
			code = code.keyCode as keyof typeof acceptableKeys;
		}
		if (typeof code === "number" && has(acceptableKeys, code)) {
			let board: IBoard = map(this.state.board, col => ({ ...col }));
			let player = { ...this.state.player };
			let boss = { ...this.state.boss };
			const { attacking, enemies } = this.state;
			player.direction = code === 65 ? player.direction : code;
			const { randomLimit, baseAttack } = player;
			const [x, y] = player.getPosition();
			let modal = 0;
			let [nextRow, nextCol] = moveSwitch(x, y, player.direction);
			const nextSpace = board[nextRow][nextCol];
			const nextPlayer = nextSpace.player;
			if (nextPlayer && enemyClasses[nextPlayer]) {
				let index = findIndex(keys(enemies), index => {
					const position = enemies[+index].getPosition();
					return position[0] === nextRow && position[1] === nextCol;
				});
				let enemy = { ...this.state.enemies[index] };
				const attack: number = randomize(randomLimit, baseAttack);
				if (nextPlayer === "boss") {
					boss.HP -= attack;
				} else if (enemy) {
					enemy.attack = true;
					enemy.HP -= attack;
					if (enemy.HP <= 0) {
						const newVillian =
							enemy.type === "hufflepuff"
								? "ravenclaw"
								: "slytherin";
						enemy = this.generateVillian(newVillian);
						player.addHP(enemy.XP);
						delete nextSpace.player;
						nextSpace.playable = true;
					}
				}
			} else if (code !== 65 && nextSpace.playable) {
				let lastSpace = board[player.row][player.column];
				player = {
					...player,
					...determineCheckpoint(
						player,
						lastSpace,
						nextSpace,
						checkpoints,
					),
				};
				delete lastSpace.player;
				if (nextRow === 23 && nextCol === 47) {
					// if you make it into the boss's lair, the door shuts behind you and all other players stop moving
					board[23][46].playable = false;
					clearInterval(timer);
					timer = setInterval(this.bossMove, 2000);
				}
				if (nextSpace.player === "wand") {
					player.addXP(10);
					modal = player.level - 2;
				} else if (nextSpace.player === "potion") {
					player.addHP(10);
					randomSpace(board, nextSpace.player, 1);
				} else if (nextSpace.player === "book") {
					modal = 3;
					board = this.alohamora();
				}
				nextSpace.player = "player";
				board = this.lumos(board, nextRow, nextCol);
				player.setPosition(nextRow, nextCol);
			}
			// if (code === player.direction) setTimeout(() => this.playerMove(code), 100);
			const direction = code === 65 ? player.direction : code;
			this.props.changeState("modal", modal);
			this.setState(
				{
					board,
					boss,
					enemies,
					player: { ...player, direction },
					attacking: code === 65 ? true : attacking,
				},
				this.win,
			);
		}
	};

	bossMove = () => {
		const board = { ...this.state.board };
		const boss = { ...this.state.boss };
		const player = { ...this.state.player };
		const oldBoss = { ...board[boss.row][boss.column] };
		const attack = randomize(4, boss.baseAttack);
		let row: number;
		let column: number;
		let newBoss;
		do {
			row = randomize(7, 15);
			column = randomize(6, 44);
			newBoss = board[row][column];
		} while (
			newBoss.playable === false ||
			(row === 15 && column === 44) ||
			newBoss.player
		);
		delete oldBoss.player;
		oldBoss.playable = true;
		newBoss.player = "boss";
		newBoss.playable = false;
		boss.setPosition(row, column);
		player.HP = player.HP > attack ? player.HP - attack : 0;
		this.setState({ boss, board, player }, this.win);
	};

	alohamora = () => {
		const board: IBoard = map(this.state.board, col => ({ ...col }));
		delete board[23][46].player;
		board[23][46].playable = true;
		return board;
	};

	enemiesSetup = (): IEnemies => {
		const { enemyType, numOfEnemies } = this.props;
		const enemies: IEnemies = {};
		for (let i = 0; i < numOfEnemies; i++) {
			enemies[i] = this.generateVillian(enemyType);
		}
		timer = setInterval(this.moveEnemies, timerDuration);
		return enemies;
	};

	moveEnemies = (): void => {
		const { enemies } = this.state;
		const shouldMove = {
			slytherin: true,
			ravenclaw: Number.isInteger(timerCount / 2),
			hufflepuff: Number.isInteger(timerCount++ / 3),
			boss: false,
		};
		for (const key in enemies) {
			const enemy = { ...enemies[key] };
			if (shouldMove[enemy.type]) {
				this.enemyMove(enemy);
			}
		}
	};

	win = () => {
		const { boss, player } = this.state;
		if ((timer && player.HP < 1) || boss.HP < 1) {
			clearInterval(timer);
			this.props.changeState("status", player.HP < 1 ? "lose" : "win");
		}
	};

	generateCheckpoints = (): void => {
		const board = map(this.state.board, col => ({ ...col }));
		const iterateCheckpointArray = (
			key: ICheckpoint,
			pQ: "toCenter" | "toEdge",
			toCenter: boolean,
		) => {
			const coords: number[][] | undefined = key[pQ];
			forEach(coords, coord => {
				if (coord) {
					let [row, column] = coord;
					board[row][column] = {
						...board[row][column],
						checkpoint: key.code,
						toCenter,
					};
				}
			});
		};

		const recurThruCheckpoints = (
			cp: ICheckpoint = checkpoints,
			str = "",
		): string[] => {
			let arr: string[] = [];
			let i = 0;
			let nextCheckpoint = cp[indexes[i]];
			while (nextCheckpoint) {
				nextCheckpoint.code = str + i;
				arr.push(nextCheckpoint.code);
				iterateCheckpointArray(nextCheckpoint, "toCenter", true);
				iterateCheckpointArray(nextCheckpoint, "toEdge", false);
				// .concat necessary for recursion
				if (nextCheckpoint[0]) {
					arr = arr.concat(
						recurThruCheckpoints(
							nextCheckpoint,
							nextCheckpoint.code,
						),
					);
				}
				nextCheckpoint = cp[indexes[++i]];
			}
			return arr;
		};
		checkpointCodes = recurThruCheckpoints();
	};

	toggleLights = (e: KeyboardEvent) => {
		const player = { ...this.state.player };
		if (e.keyCode === 32 && player.lumosPlus) {
			let board = map(this.state.board, col => ({ ...col }));
			let [row, col] = player.getPosition();
			const illuminate = luminate(row, col, board);
			player.lumosToggle = !player.lumosToggle;
			for (let i = -2; i <= 2; i++) {
				illuminate(2, i);
				illuminate(i, 2);
				illuminate(-2, i);
				illuminate(i, -2);
			}
			if (player.lumosToggle) {
				player.cloaked = false;
			} else if (player.hasCloak) {
				player.cloaked = true;
			}
			this.setState({ board, player });
		}
	};

	keyup = (e: KeyboardEvent) => {
		const { keyCode } = e;
		if (keyCode === 65) {
			this.setState({ attacking: false });
		} else if (directionKeys[keyCode]) {
			const { player } = this.state;
			this.setState({ player: { ...player, direction: undefined } });
		}
	};

	componentDidMount() {
		document.addEventListener("keydown", this.playerMove, true);
		document.addEventListener("keypress", this.toggleLights, true);
		document.addEventListener("keyup", this.keyup, true);
		const board: IBoard = this.lumos(this.state.board, 28, 28);
		const enemies: IEnemies = this.enemiesSetup();
		this.setState({ board, enemies });
	}

	render(): JSX.Element {
		const { player } = this.state;
		const { modal, changeState, board } = this.props;
		const { title, body } = modalText[modal];
		return (
			<div>
				<div className={`static-modal ${modal ? "" : "modal-hide"}`}>
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Title>{title}</Modal.Title>
						</Modal.Header>
						<Modal.Body>{body}</Modal.Body>
						<Modal.Footer>
							<Button
								variant="primary"
								onClick={partial(changeState, "modal", 0)}
							>
								Got It!
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</div>
				<div>
					<Stats player={player} />
				</div>
				<Board board={board} cloaked={player.cloaked} />
			</div>
		);
	}
}
