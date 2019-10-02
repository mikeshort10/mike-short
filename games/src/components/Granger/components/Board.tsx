import React from "react";
import "./../style.css";
import { map } from "lodash";
import { PlayerType, IBoard } from "../types";

const iconClasses = {
	wand: "fas fa-scroll",
	potion: "fas fa-flask",
	boss: "fas fa-skull",
	door: "fas fa-lock",
	book: "fas fa-book",
	player: "fas fa-hat-wizard",
	ravenclaw: "fas fa-hat-wizard",
	slytherin: "fas fa-hat-wizard",
	hufflepuff: "fas fa-hat-wizard",
};

const getIconClass = (player: PlayerType) => {
	return player ? `${iconClasses[player]} ${player}` : "";
};

export interface SpaceProps {
	player: PlayerType;
	darkness: boolean;
	playable: boolean;
	toCenter?: boolean;
	checkpoint?: string;
	checkpoints?: number[][];
}

export function Space(props: SpaceProps) {
	const { player, playable, darkness } = props;
	const iconClass = player ? getIconClass(player) : "";
	const isWall = !playable && (!player || player === "door");
	const spaceClass = darkness ? "darkness" : isWall ? "wall" : "space";
	return (
		<div className={spaceClass}>
			<i className={iconClass} />
		</div>
	);
}

interface BoardProps {
	board: IBoard;
	cloaked: boolean;
}

export class Board extends React.Component<BoardProps> {
	render() {
		const { board, cloaked } = this.props;
		const isCloaked = cloaked ? "-cloaked" : "";
		const arr = map(board, (col, i) => {
			map(col, (space, j) => {
				return <Space key={i + j} {...space} />;
			});
		});
		return <div id={`granger-board${isCloaked}`}>{arr}</div>;
	}
}

export default Board;
