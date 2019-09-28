import React from "react";
import "./style.css";
import { checkpoints } from "./JSON/checkpoints.json";
import { Begin, Instructions, Settings, Play, Lose } from "./components";
import {
	lumos,
	playerMove,
	enemyMove,
	moveEnemies,
	boardSetup,
	generateVillian,
} from "./functions";
import { IAbilities, IBoard, SpaceProps, Player } from "./components/Board";

//As I level up, my attack changes
//directions for cloak
//directions for lumos
//directions for book
//I can move on to level 2 😱

export interface IPlayer {
	level: number;
	HP: number;
}

export interface IBoss {
	HP: number;
}

export type EnemyHouse = "hufflepuff" | "ravenclaw" | "slytherin";

export interface IGrangerProps {}

export interface IGrangerState {
	status: "begin" | "instructions" | "play" | "select" | "lose";
	codeArr: [];
	attacking: boolean;
	numOfEnemies: number;
	enemyType: "hufflepuff" | "ravenclaw" | "slytherin";
	modal: number;
	player: IPlayer;
	testMode: boolean;
	hasCloak: boolean;
	cloaked: boolean;
	lumosPlus: boolean;
	lumosToggle: boolean;
	boss: IBoss;
	board: IBoard;
}

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

export class Granger extends React.Component<IGrangerProps, IGrangerState> {
	constructor(props: IGrangerProps) {
		super(props);
		this.state = {
			status: "play",
			codeArr: [],
			attacking: false,
			numOfEnemies: 12,
			enemyType: "hufflepuff",
			modal: 0,
			player: {
				level: 1,
				HP: 1,
			},
			testMode: false,
			cloaked: false,
			hasCloak: false,
			lumosPlus: false,
			lumosToggle: false,
			board: 
		};
		this.playerMove = playerMove.bind(this);
		this.lumos = lumos.bind(this);
		this.generateVillian = generateVillian.bind(this);
		this.boardSetup = boardSetup.bind(this);
		this.moveEnemies = moveEnemies.bind(this);
	}

	moveEnemies(): void {
		if (this.state.status === "play") {
			const { board, player, enemies, timer } = { ...this.state };
			const moveHuffs = Number.isInteger(timer.count / 3);
			const moveRavs = Number.isInteger(timer.count++ / 2);
			for (let enemy of enemies) {
				const { player } = enemy;
				if (
					player === "slytherin" ||
					(moveRavs && player === "ravenclaw") ||
					(moveHuffs && player === "hufflepuff")
				) {
					this.enemyMove(key, board, player, enemies);
				}
			}
			this.setState({ board, enemies, player, timer }, this.win);
		}
	}

	determineCheckpoint = (player, lastSpace, currentSpace) => {
		let [coords, lastCheckpoint] = [
			player.lastCheckpoint,
			player.checkpointCode,
		];
		let currentCode = currentSpace.checkpoint;
		if (
			currentCode !== undefined &&
			lastSpace.checkpoint === currentCode &&
			lastSpace.toCenter !== currentSpace.toCenter
		) {
			lastCheckpoint =
				lastSpace.toCenter || currentCode.length === 1
					? currentCode
					: currentSpace.checkpoint.substr(0, currentCode.length - 1);
			coords = this.findCheckpoint(lastCheckpoint);
		}
		return [coords, lastCheckpoint];
	};

	findCheckpoint = (str, q, route = checkpoints) => {
		if (str.length === 1) {
			return q ? route[str].q[0] : route[str].p[0];
		}
		let newRoute = route[str[0]];
		let slicedString = str.substr(1);
		return this.findCheckpoint(slicedString, q, newRoute);
	};

	bossMove = () => {
		const board = { ...this.state.board };
		const boss = { ...this.state.boss };
		const player = { ...this.state.player };
		const oldBoss = board[boss.position[0]][boss.position[1]];
		const attack = Math.floor(Math.random() * 4) + boss.baseAttack;
		let row: number;
		let column: number;
		let newBoss;
		do {
			row = Math.floor(Math.random() * 7) + 15;
			column = Math.floor(Math.random() * 6) + 44;
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
		boss.position = [row, column];
		player.HP = player.HP > attack ? player.HP - attack : 0;
		this.setState({ boss, board, player }, this.win);
	};

	alohomora = (board: IBoard) => {
		delete board[23][46].player;
		board[23][46].playable = true;
		return board;
	};

	keyup = (e: React.KeyboardEvent) => {
		if (e.keyCode === 65) {
			this.setState({ attacking: false });
		} else if (e.keyCode > 36 && e.keyCode < 41) {
			this.setState({ playerDirection: undefined });
		}
	};

	toggleLights = (e: React.KeyboardEvent) => {
		let { lumosPlus, lumosToggle, hasCloak, cloaked } = this.state;
		if (e.keyCode === 32 && lumosPlus) {
			let board = { ...this.state.board };
			let [row, col] = this.state.player.position;
			const illuminate = luminate(row, col, board);
			lumosToggle = !lumosToggle;
			for (let i = -2; i <= 2; i++) {
				illuminate(2, i);
				illuminate(i, 2);
				illuminate(-2, i);
				illuminate(i, -2);
			}
			if (lumosToggle) {
				cloaked = false;
			} else if (hasCloak) {
				cloaked = true;
			}
			this.setState({
				board,
				lumosPlus,
				lumosToggle,
				hasCloak,
				cloaked,
			});
		}
	};

	generateCheckpoints = (board: IBoard) => {
		function iterateCheckpointArray(key, pQ, toCenter) {
			for (let i = 0; i < pQ.length; i++) {
				let [row, column] = pQ[i];
				board[row][column].checkpoint = key.s;
				board[row][column].toCenter = toCenter;
			}
		}
		function recurThruCheckpoints(cp = checkpoints, str = "") {
			let arr = [];
			for (let i = 0; cp[i]; i++) {
				cp[i].s = str + i;
				arr.push(cp[i].s);
				iterateCheckpointArray(cp[i], cp[i].p, true);
				iterateCheckpointArray(cp[i], cp[i].q, false);
				// .concat necessary for recursion
				if (cp[i][0])
					arr = arr.concat(recurThruCheckpoints(cp[i], cp[i].s));
			}
			return arr;
		}
		return recurThruCheckpoints();
	};

	randomSpace = (board: IBoard, player: Player, num: number) => {
		for (let i = 0; i < num; i++) {
			let row: number;
			let column: number;
			let space: SpaceProps;
			do {
				row = Math.floor(Math.random() * 50);
				column = Math.floor(Math.random() * 50);
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
		const { boss, player, timer } = this.state;
		if (player.HP < 1 || boss.HP < 1) {
			clearInterval(timer.id);
			if (boss.timer) clearInterval(boss.timer);
			this.setState({ status: player.HP < 1 ? "...lose" : "win!" });
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
						abilities={this.state.abilities}
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
