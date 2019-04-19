import React from "react";
import "./../style.css";

export function Space(props) {
	const space = props.space;
	const player = space.player;
	const spaceClass = (() => {
		if (props.space.darkness) return "darkness";
		else if (
			!props.space.playable &&
			(props.space.player === undefined || props.space.player === "door")
		)
			return "wall";
		else return "space";
	})();
	const iconClass = (() => {
		switch (player) {
			case "wand":
				return "fas fa-scroll wand";
			case "potion":
				return "fas fa-flask potion";
			case "boss":
				return "fas fa-skull boss";
			case "door":
				return "fas fa-lock door";
			case "book":
				return "fas fa-book book";
			default:
				return props.space.player
					? "fas fa-hat-wizard " + props.space.player
					: "";
		}
	})();

	return (
		<div className={spaceClass}>
			<i className={iconClass} />
		</div>
	);
}

export default class Board extends React.Component {
	createBoard() {
		const isCloaked = this.props.abilities.cloaked ? "-cloaked" : "";
		const board = { ...this.props.board };
		let arr = [];
		for (let row in board) {
			for (let column in board[row]) {
				arr.push(
					<Space
						key={row + " " + column}
						space={board[row][column]}
					/>,
				);
			}
		}
		return <div id={`granger-board${isCloaked}`}>{arr}</div>;
	}
	render() {
		return this.createBoard();
	}
}

export { Board };
