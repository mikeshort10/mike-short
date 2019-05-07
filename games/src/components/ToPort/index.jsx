import React from "react";
import classNames from "classnames/bind";

const style = require("./index.scss");
const cs = classNames.bind(style);

export class ToPort extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			boardLength: 44,
		};
	}

	renderSpaces = () => {
		const board = [];
		for (let i = 0; i < this.state.spaces.length; i++) {
			const space = this.state.spaces[i];
			const isPort = `${space.team} port` || "land";
			const isShip = `${space.team} ship` || "sea";
			const landOrSea = space.isLand ? isPort : isShip;
			const reachable = space.isReachable || "";
			board.push(
				<div id={i} className={cs(landOrSea, reachable)}>
					{space.reachable}
				</div>,
			);
		}
		return board;
	};

	moveShip = index => {
		const board = [...this.state.board];
		const reachableSpaces = [...this.state.reachableSpaces];
		const { windDirection, boardLength } = this.state;
		const { selected, isSea, team } = board[index];
		let { roll } = this.state;
		board[index] = { ...board[index], selected: !selected };

		if (selected) {
			const adjSpaces = [-boardLength, 1, boardLength, -1];
			adjSpaces[windDirection] *= 2;

			function recurseReachable(index, reachable) {
				if (reachable < 1) {
					return;
				} else {
					const i = reachableSpaces.find(x => x >= index);
					if (i !== index && isSea && team === undefined) {
						reachableSpaces[i].splice(i, 0, index);
					}
					for (let i = 0; i < adjSpaces.length; i++) {
						recurseReachable(index - adjSpaces[i], reachable);
					}
				}
			}

			recurseReachable(index, roll);
		} else if (board[index].reachable) {
		}

		this.setState({ board, roll });
	};

	render() {
		return <div className={cs("board")}>{this.renderSpaces}</div>;
	}
}
