import React from "react";
import { map, partial } from "lodash";
require("./style.css");

interface IState {
	cells: boolean[];
	generation: number;
	gamePlay: boolean;
	isFast: boolean;
}

let timer: NodeJS.Timeout | undefined;

export class Conway extends React.Component<{}, IState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			cells: [],
			generation: 0,
			gamePlay: true,
			isFast: true,
		};
	}

	createTissue = () => {
		return map(this.state.cells, (cell, i) => (
			<div
				key={i}
				className={`cell ${cell ? "alive" : "dead"}`}
				onClick={partial(this.handleClick, i)}
			/>
		));
	};

	handleClick = (num: number) => {
		const cells = [...this.state.cells];
		cells.splice(num, 1, true);
		this.setState({ cells });
	};

	handOfFate = () => {
		const generation = this.state.generation + 1;
		const cells = map([...this.state.cells], (cell, num) => {
			let livingNeighbors = 0;
			for (let i = -1; i < 1; i++) {
				for (let j = -1; j < 1; j++) {
					const neighbor = cells[num + i * 30 + j];
					if ((i || j) && neighbor) {
						livingNeighbors++;
					}
				}
			}
			if (livingNeighbors === 3) {
				return true;
			} else {
				return livingNeighbors === 2 ? cell : false;
			}
		});
		this.setState({ cells, generation });
	};

	adjustTemperature = () => {
		const isFast = !this.state.isFast;
		if (timer) {
			clearInterval(timer);
		}
		timer = setInterval(this.handOfFate, isFast ? 100 : 1000);
		this.setState({ isFast });
	};

	clearBoard = () => {
		if (timer) {
			clearInterval(timer);
		} else {
			timer = setInterval(this.handOfFate, 100);
		}
		this.setState({
			cells: Array(1500).fill(false),
			generation: 0,
			gamePlay: false,
			isFast: true,
		});
	};

	componentDidMount() {
		let cells = [];
		for (let i = 0; i < 1500; i++) {
			cells.push(Math.random() < 0.5);
		}
		timer = setInterval(this.handOfFate, 100);
		this.setState({ cells });
	}

	render() {
		const { isFast, generation, gamePlay } = this.state;
		return (
			<div>
				<div id="tissue">{this.createTissue()}</div>
				<div id="buttons">
					<div>Generation: {generation}</div>
					<div onClick={this.handOfFate}>
						{gamePlay ? "Stop" : "Start"}
					</div>
					<div onClick={this.adjustTemperature}>
						{isFast ? "Slow Down" : "Speed Up"}
					</div>
					<div onClick={this.clearBoard}>Clear Board</div>
				</div>
			</div>
		);
	}
}
