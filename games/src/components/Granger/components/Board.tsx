import React from "react";
import "./../style.css";
import { map } from "lodash";
import { EnemyHouse } from "..";

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

const getIconClass = (player: Player) => {
	return player ? `${iconClasses[player]} ${player}` : "";
};

export type Player =
	| "wand"
	| "potion"
	| "boss"
	| "door"
	| "book"
	| "player"
	| EnemyHouse
	| undefined;

export interface SpaceProps {
	player: Player;
	darkness: boolean;
	playable: boolean;
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

export interface IBoard {
	[key: number]: { [key: number]: SpaceProps };
}

export interface IAbilities {
	cloaked: boolean;
}

interface BoardProps {
	abilities: IAbilities;
	board: IBoard;
}

export class Board extends React.Component<BoardProps> {
	render() {
		const { board, abilities } = this.props;
		const isCloaked = abilities.cloaked ? "-cloaked" : "";
		const arr = map(board, (col, i) => {
			map(col, (space, j) => {
				return <Space key={i + j} {...space} />;
			});
		});
		return <div id={`granger-board${isCloaked}`}>{arr}</div>;
	}
}

export default Board;
