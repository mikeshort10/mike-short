import { EnemyHouse, IBoard } from "../types";

export interface IBossProps {
	board: IBoard;
	HP: number;
	baseAttack: number;
}

export class Boss {
	constructor(props: IBossProps) {
		const { board, HP, baseAttack } = props;
		this.type = "boss";
		this.row = 24;
		this.column = 51;
		this.lastCheckpoint = this.getPosition();
		this.checkpointCode = board[this.row][this.column].checkpoint || "";
		this.HP = HP;
		this.baseAttack = baseAttack;
		this.attack = true;
		this.XP = 100;
	}

	type: EnemyHouse | "boss";
	HP: number;
	attack: boolean;
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
