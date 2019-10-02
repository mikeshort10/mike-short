import { Boss, IBossProps } from "./Boss";
import { EnemyHouse } from "../types";

interface IEnemyProps extends IBossProps {
	HP: number;
	baseAttack: number;
	type: EnemyHouse;
	row: number;
	column: number;
	XP: number;
}

export class Enemy extends Boss {
	constructor(props: IEnemyProps) {
		super(props);
		const { row, column, HP, XP, baseAttack, type, board } = props;
		this.type = type;
		this.row = row;
		this.column = column;
		this.lastCheckpoint = this.getPosition();
		this.checkpointCode = board[row][column].checkpoint || "";
		this.HP = HP;
		this.XP = XP;
		this.baseAttack = baseAttack;
	}
}

export interface IEnemies {
	[key: number]: Enemy;
}
