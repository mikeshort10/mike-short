import { SpaceProps } from "../components/Board";

export interface ICheckpoints {
	"0": ICheckpoint;
	"1": ICheckpoint;
	"2": ICheckpoint;
	"3": ICheckpoint;
}

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

export interface IObstacles {
	[key: string]: { [key: string]: boolean };
}

export type DirectionKeys = { [x: number]: boolean };

export interface IBoard {
	[key: number]: { [key: number]: SpaceProps };
}

export type EnemyHouse = "hufflepuff" | "ravenclaw" | "slytherin";

export interface IDefaultEnemyProps {
	hufflepuff: { HP: number; XP: number; baseAttack: number };
	ravenclaw: { HP: number; XP: number; baseAttack: number };
	slytherin: { HP: number; XP: number; baseAttack: number };
}

export type PlayerType =
	| "wand"
	| "potion"
	| "boss"
	| "door"
	| "book"
	| "player"
	| EnemyHouse
	| undefined;
