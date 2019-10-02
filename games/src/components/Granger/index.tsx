import React from "react";
import "./style.css";
import { Begin, Instructions, Settings, Play, Lose } from "./components";
import { randomSpace } from "./functions/randomize";
import { obstacles } from "./JSON/obstacles.json";
import { IBoard } from "./types";

export interface IGrangerProps {}

export interface IGrangerState {
	status: "begin" | "instructions" | "play" | "select" | "lose" | "win";
	numOfEnemies: number;
	enemyType: "hufflepuff" | "ravenclaw" | "slytherin";
	modal: number;
	testMode: boolean;
	board: IBoard;
}

export const enemyClasses: { [key: string]: boolean } = {
	hufflepuff: true,
	ravenclaw: true,
	slytherin: true,
	boss: true,
};

export class Granger extends React.Component<IGrangerProps, IGrangerState> {
	constructor(props: IGrangerProps) {
		super(props);
		const testMode = false;
		this.state = {
			status: "play",
			numOfEnemies: 12,
			enemyType: "hufflepuff",
			modal: 0,
			testMode,
			board: {},
		};
	}

	boardSetup = (testMode?: boolean): IBoard => {
		testMode = this.state ? this.state.testMode : testMode;
		const board: IBoard = {};
		for (let i = 0; i < 54; i++) {
			board[i] = {};
			for (let j = 0; j < 54; j++) {
				board[i][j] = {
					player: undefined,
					playable: obstacles[i] !== undefined,
					darkness: !testMode,
				};
			}
		}
		board[36][48].player = "book";
		board[23][46].player = "door";
		board[28][28].player = "player";
		randomSpace(board, "wand", 12);
		randomSpace(board, "potion", 6);
		return board;
	};

	changeStatus = (status: IGrangerState["status"]) => {
		const shouldSetUpBoard = status === "play" ? this.boardSetup : () => {};
		this.setState({ status }, shouldSetUpBoard);
	};

	changeState = (key: keyof IGrangerState, val: any): void => {
		const newProps = { [key]: val };
		this.setState(newProps as Pick<IGrangerState, typeof key>);
	};

	componentDidMount() {
		const body = document.getElementsByTagName("body")[0];
		body.setAttribute("class", "lindsay-granger");
		const board = this.boardSetup();
		this.setState({ board });
	}

	render(): JSX.Element | null {
		const { status, ...playProps } = this.state;
		const { board } = this.state;
		const components = {
			begin: <Begin changeStatus={this.changeStatus} />,
			instructions: <Instructions changeStatus={this.changeStatus} />,
			lose: <Lose status={status} changeStatus={this.changeStatus} />,
			play: board[0] ? (
				<Play {...playProps} changeState={this.changeState} />
			) : null,
			win: board[0] ? (
				<Play {...playProps} changeState={this.changeState} />
			) : null,
			select: (
				<Settings
					changeState={this.changeState}
					changeStatus={this.changeStatus}
					enemyType={this.state.enemyType}
					numOfEnemies={this.state.numOfEnemies}
				/>
			),
		};
		return components[this.state.status] || null;
	}
}

export default Granger;
