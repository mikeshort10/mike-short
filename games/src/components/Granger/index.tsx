import React from "react";
import "./style.css";
import { checkpoints } from "./JSON/checkpoints.json";
import { Begin, Instructions, Settings, Play, Lose } from "./components";
import { moveSwitch } from "./functions/moveSwitch";
import { IBoard, SpaceProps, Player as IPlayer } from "./components/Board";
import { randomize } from "./functions/randomize";

import { obstacles } from "./JSON/obstacles.json";
import { findIndex, keys, has } from "lodash";

export const directionKeys: { [x: number]: boolean } = {
	37: true,
	38: true,
	39: true,
	40: true,
};

export const acceptableKeys = { ...directionKeys, 65: true };

//As I level up, my attack changes
//directions for cloak
//directions for lumos
//directions for book
//I can move on to level 2 😱

const indexes: Array<"0" | "1" | "2" | "3" | "4" | "5"> = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
];

export interface ICheckpoint {
	"0"?: ICheckpoint;
	"1"?: ICheckpoint;
	"2"?: ICheckpoint;
	"3"?: ICheckpoint;
	"4"?: ICheckpoint;
	"5"?: ICheckpoint;
	toCenter?: number[][];
	toEdge?: number[][];
	code?: string;
}

export interface IEnemies {
	[key: number]: Enemy;
}

export type EnemyHouse = "hufflepuff" | "ravenclaw" | "slytherin";

export interface IGrangerProps {}

const defaultEnemyProps: IDefaultEnemyProps = {
	hufflepuff: { HP: 20, XP: 15, baseAttack: 6 },
	ravenclaw: { HP: 30, XP: 20, baseAttack: 10 },
	slytherin: { HP: 50, XP: 35, baseAttack: 15 },
};

const bossProps = { XP: 100, row: 24, column: 51 };

export interface IGrangerState {
	status: "begin" | "instructions" | "play" | "select" | "lose" | "win";
	codeArr: [];
	attacking: boolean;
	numOfEnemies: number;
	enemyType: "hufflepuff" | "ravenclaw" | "slytherin";
	modal: number;
	player: Player;
	testMode: boolean;
	boss: Enemy;
	board: IBoard;
	checkpointCodes: string[];
	enemies: IEnemies;
}

interface IDefaultEnemyProps {
	hufflepuff: { HP: number; XP: number; baseAttack: number };
	ravenclaw: { HP: number; XP: number; baseAttack: number };
	slytherin: { HP: number; XP: number; baseAttack: number };
}

export const enemyClasses: { [key: string]: boolean } = {
	hufflepuff: true,
	ravenclaw: true,
	slytherin: true,
	boss: true,
};

const timerDuration = 500;

const modalText = [
	{ title: "", body: "" },
	{
		title: "Where'd you go?!",
		body: `You've discovered that the cloak you're wearing is the legendary
invisibility cloak! While under your cloak, spaces will appear blue, and
enemies cannot see you unless you run into them!`,
	},
	{
		title: "Who turned on the light?",
		body: `With all this practice, you're able to perform lumos! Now you can
see twice the distance! Be careful though: your cloak won't work while you're
casting the lumos spell. Press " + <i className="fa fa-stop-button"/> + " to
toggle the spell.`,
	},
	{
		title: "The Imperious Counter-Curse!",
		body: `You've discovered the Imperius Countercurse! Now all that's left to do
is to find where the Death Eater is hidden in the castle.`,
	},
];

const luminate = (playerRow: number, playerCol: number, board: IBoard) => {
	return (row: number, column: number) => {
		[row, column] = [playerRow + row, playerCol + column];
		board[row][column].darkness = !board[row][column].darkness;
	};
};

let timer: NodeJS.Timeout;
let timerCount: number = 0;

interface IEnemyProps {
	row: number;
	column: number;
	HP: number;
	XP: number;
	baseAttack: number;
	type: EnemyHouse | "boss";
	board: IBoard;
}

export class Enemy {
	constructor(props: IEnemyProps) {
		const { row, column, HP, XP, baseAttack, type, board } = props;
		this.type = type;
		this.row = row;
		this.column = column;
		this.lastCheckpoint = this.getPosition();
		this.checkpointCode = board[row][column].checkpoint;
		this.HP = HP;
		this.XP = XP;
		this.baseAttack = baseAttack;
	}
	type: EnemyHouse | "boss";
	HP: number;
	attack: boolean = false;
	row: number;
	column: number;
	lastCheckpoint: number[];
	checkpointCode: string;
	XP: number;
	baseAttack: number;

	getPosition = (): number[] => {
		return [this.row, this.column];
	};

	setPosition = (row: number, column: number): void => {
		this.row = row;
		this.column = column;
	};
}

class Player {
	constructor() {
		this.HP = this.maxHP = 30;
	}
	row: number = 28;
	column: number = 28;
	lastCheckpoint: number[] = [23, 33];
	checkpointCode: string = "1";
	level: number = 1;
	randomLimit: number = 4;
	baseAttack: number = 6;
	HP: number;
	maxHP: number;
	XP: number = 0;
	attack: string = "Stupify";
	hasCloak: boolean = false;
	cloaked: boolean = false;
	lumosPlus: boolean = false;
	lumosToggle: boolean = false;
	direction?: 37 | 38 | 39 | 40;

	addXP = (XP: number): void => {
		const XPtoNextLevel = (this.level + 1) * 10;
		if (XP >= XPtoNextLevel) {
			this.XP = XP % XPtoNextLevel;
			this.level++;
			this.maxHP += 10;
			this.addHP(10);
			this.baseAttack += 2;
		}
		if (this.level === 3) {
			this.hasCloak = this.cloaked = true;
		} else if (this.level === 5) {
			this.lumosPlus = true;
		}
	};

	addHP = (HP: number): void => {
		this.HP = Math.min(HP + this.HP, this.maxHP);
	};

	getPosition = (): number[] => {
		return [this.row, this.column];
	};

	setPosition = (row: number, column: number): void => {
		this.row = row;
		this.column = column;
	};
}

export class Granger extends React.Component<IGrangerProps, IGrangerState> {
	constructor(props: IGrangerProps) {
		super(props);
		const board = this.boardSetup();
		this.state = {
			status: "play",
			codeArr: [],
			attacking: false,
			numOfEnemies: 12,
			enemyType: "hufflepuff",
			modal: 0,
			player: new Player(),
			testMode: false,
			board,
			boss: this.generateVillian("boss"),
			enemies: {},
			checkpointCodes: this.generateCheckpoints(board),
		};
	}

	lumos = (board: IBoard, row: number, col: number) => {
		const { lumosPlus, lumosToggle } = this.state.player;
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

	boardSetup = () => {
		const board: IBoard = {};
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
		this.lumos(board, 28, 28);
		this.randomSpace(board, "wand", 12);
		this.randomSpace(board, "potion", 6);
		return board;
	};

	enemiesSetup = (): void => {
		const { enemyType, numOfEnemies } = this.state;
		const boss = this.generateVillian("boss");
		const enemies: IEnemies = {};
		for (let i = 0; i < numOfEnemies; i++) {
			enemies[i] = this.generateVillian(enemyType);
		}
		timer = setInterval(this.moveEnemies, timerDuration);
		this.setState({ boss, enemies });
	};

	enemyMove = (enemy: Enemy) => {
		let board = { ...this.state.board };
		let lindsay = { ...this.state.player };
		let newRow: number,
			newCol: number,
			destination,
			destinationCode = "";
		let [row, column] = ([newRow, newCol] = enemy.getPosition());
		if (!enemy.attack) {
			const code = randomize(4, 37);
			[newRow, newCol] = moveSwitch(row, column, code);
			if (
				!board[newRow][newCol].playable ||
				board[newRow][newCol].player === "book"
			) {
				[newRow, newCol] = [row, column];
			}
		} else {
			const [pCC, eCC] = [lindsay.checkpointCode, enemy.checkpointCode];
			if (pCC === eCC) {
				[destination, destinationCode] = [lindsay.getPosition(), pCC];
			} else {
				let i = 0;
				while (eCC[i] && pCC[i] === eCC[i]) {
					destinationCode += eCC[i++];
				}
				if (
					row === enemy.lastCheckpoint[0] &&
					column === enemy.lastCheckpoint[1]
				) {
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
				destination = this.findCheckpoint(destinationCode);
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
			if (enemy.attack) {
				let damage = Math.ceil(Math.random() * 4 + enemy.baseAttack);
				lindsay.HP -= Math.max(lindsay.HP - damage, 0);
			}
			enemy.attack = true;
		} else {
			if (player === "wand" || player === "potion") {
				this.randomSpace(board, player, 1);
			}
			delete oldEnemy.player;
			oldEnemy.playable = true;
			newEnemy.player = enemy.type;
			newEnemy.playable = false;
			enemy.setPosition(newRow, newCol);
			if (!(darkness && lindsay.cloaked && this.state.testMode)) {
				enemy.attack = true;
			}
		}
	};

	generateVillian = (type: EnemyHouse | "boss"): Enemy => {
		const { checkpointCodes, numOfEnemies } = this.state;
		let board = { ...this.state.board };
		let index: number;
		let code: string;
		do {
			index = randomize(checkpointCodes.length);
			code = checkpointCodes[index];
		} while (code.length < 2 || index === checkpointCodes.length - 1);
		const [row, column] = this.findCheckpoint(code, true);
		board[row][column].player = type;
		board[row][column].playable = false;
		const commonProps = { board, type };
		return type === "boss"
			? new Enemy({
					...commonProps,
					...bossProps,
					HP: numOfEnemies * 9,
					baseAttack: numOfEnemies,
			  })
			: new Enemy({
					...defaultEnemyProps[type],
					...commonProps,
					row,
					column,
			  });
	};

	moveEnemies = (): void => {
		const { status, enemies } = this.state;
		if (status === "play") {
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
		}
	};

	playerMove = (code: keyof typeof acceptableKeys | KeyboardEvent) => {
		if (typeof code !== "number" && has(acceptableKeys, code.keyCode)) {
			code = code.keyCode as keyof typeof acceptableKeys;
		}
		if (typeof code === "number" && has(acceptableKeys, code)) {
			let board = { ...this.state.board };
			let player = { ...this.state.player };
			let boss = { ...this.state.boss };
			const { attacking, enemies } = this.state;
			player.direction = code === 65 ? player.direction : code;
			const { randomLimit, baseAttack } = player;
			let { lastCheckpoint, checkpointCode } = player;
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
					...this.determineCheckpoint(player, lastSpace, nextSpace),
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
					this.randomSpace(board, nextSpace.player, 1);
				} else if (nextSpace.player === "book") {
					modal = 3;
					board = this.alohamora(board);
				}
				nextSpace.player = "player";
				board = this.lumos(board, nextRow, nextCol);
				player.setPosition(nextRow, nextCol);
			}
			// if (code === player.direction) setTimeout(() => this.playerMove(code), 100);
			const direction = code === 65 ? player.direction : code;
			this.setState(
				{
					modal,
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

	determineCheckpoint = (
		player: Player,
		lastSpace: SpaceProps,
		currentSpace: SpaceProps,
	): { lastCheckpoint: number[]; checkpointCode: string } => {
		const { checkpoint, toCenter } = currentSpace;
		let { lastCheckpoint, checkpointCode } = player;
		const sameCheckpoint = lastSpace.checkpoint === checkpoint;
		const differentDirection = lastSpace.toCenter !== toCenter;
		if (checkpoint && sameCheckpoint && differentDirection) {
			checkpointCode =
				lastSpace.toCenter || checkpoint.length === 1
					? checkpoint
					: checkpoint.substr(0, checkpoint.length - 1);
			lastCheckpoint = this.findCheckpoint(checkpointCode);
		}
		return { lastCheckpoint, checkpointCode };
	};

	findCheckpoint = (
		code: string,
		isToEdge: boolean,
		route: ICheckpoint = checkpoints,
	): number[] => {
		if (
			code === "0" ||
			code === "1" ||
			code === "2" ||
			code === "3" ||
			code === "4" ||
			code === "5"
		) {
			if (route[code] !== undefined) {
				const { toCenter, toEdge } = route[code] as ICheckpoint;
				const nextStep = isToEdge ? toEdge : toCenter;
				return nextStep ? nextStep[0] : [];
			}
			const newRoute = route[code[0]];
			const slicedString = code.substr(1);
			return this.findCheckpoint(slicedString, isToEdge, newRoute);
		}
		console.error("findCheckpoints returned undefined");
		return [];
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

	alohamora = (board: IBoard) => {
		delete board[23][46].player;
		board[23][46].playable = true;
		return board;
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

	toggleLights = (e: KeyboardEvent) => {
		const player = { ...this.state.player };
		if (e.keyCode === 32 && player.lumosPlus) {
			let board = { ...this.state.board };
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

	generateCheckpoints = (board: IBoard) => {
		const iterateCheckpointArray = (
			key: ICheckpoint,
			pQ: "toCenter" | "toEdge",
			toCenter: boolean,
		) => {
			for (let i = 0; i < pQ.length; i++) {
				const coords: number[][] | undefined = key[pQ];
				if (coords) {
					let [row, column] = coords[i];
					board[row][column] = {
						...board[row][column],
						checkpoint: key.code,
						toCenter,
					};
				}
			}
		};

		const recurThruCheckpoints = (
			cp: ICheckpoint = checkpoints,
			str = "",
		): string[] => {
			let arr: string[] = [];
			let i = 0;
			let nextCheckpoint = cp[indexes[i]];
			while (nextCheckpoint) {
				const code = (nextCheckpoint.code = str + i);
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
		return recurThruCheckpoints();
	};

	randomSpace = (board: IBoard, player: IPlayer, num: number) => {
		for (let i = 0; i < num; i++) {
			let row: number;
			let column: number;
			let space: SpaceProps;
			do {
				row = randomize(50);
				column = randomize(50);
				space = board[row][column];
			} while (
				!space.playable ||
				space.player ||
				(row > 20 && row < 32) ||
				(column > 20 && column < 32)
			);
			space.player = player;
		}
	};

	changeStatus = (status: IGrangerState["status"]) => {
		const shouldSetUpBoard = status === "play" ? this.boardSetup : () => {};
		this.setState({ status }, shouldSetUpBoard);
	};

	changeState = (key: keyof IGrangerState, val: any): void => {
		const newProps = { [key]: val };
		this.setState(newProps as Pick<IGrangerState, typeof key>);
	};

	win = () => {
		const { boss, player } = this.state;
		if ((timer && player.HP < 1) || boss.HP < 1) {
			clearInterval(timer);
			this.setState({ status: player.HP < 1 ? "lose" : "win" });
		}
	};

	componentDidMount() {
		document.addEventListener("keydown", this.playerMove, true);
		document.addEventListener("keypress", this.toggleLights, true);
		document.addEventListener("keyup", this.keyup, true);
		document
			.getElementsByTagName("body")[0]
			.setAttribute("class", "lindsay-granger");
		this.boardSetup();
	}

	render() {
		switch (this.state.status) {
			case "begin":
				return <Begin changeStatus={this.changeStatus} />;
			case "instructions":
				return <Instructions changeStatus={this.changeStatus} />;
			case "select":
				return (
					<Settings
						changeState={this.changeState}
						changeStatus={this.changeStatus}
						enemyType={this.state.enemyType}
						numOfEnemies={this.state.numOfEnemies}
					/>
				);
			case "play":
				return (
					<Play
						modal={this.state.modal}
						modalText={modalText}
						setState={this.setState}
						player={this.state.player}
						board={this.state.board}
					/>
				);
			case "lose":
				return (
					<Lose
						status={this.state.status}
						changeStatus={this.changeStatus}
					/>
				);
			default:
				return null;
		}
	}
}

export default Granger;
