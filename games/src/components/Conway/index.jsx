import React, { Component } from "react";

export class Conway extends Component {
	createTissue() {
		let arr = [];
		for (let i = 0; i < this.state.cells.length; i++) {
			const cN = this.state.cells[i] ? "alive" : "dead";
			const handleClick = () => this.handleClick(i);
			arr.push(<div className={cN} onClick={handleClick} />);
		}
		return arr;
	}

	handleClick(num) {
		this.setState({ cells: [...this.state.cells].splice(num, 1, true) });
	}

	handOfFate() {
		let cells = [...this.state.cells];
		const generation = this.state.generation + 1 || 1;
		for (let num = 0; num < cells.length; num++) {
			let livingNeighbors = 0;
			for (let i = -1; i < 1; i++) {
				for (let j = -1; j < 1; j++) {
					if (i === 0 && j === 0) continue;
					else if (cells[num + i * 30 + j]) livingNeighbors++;
				}
			}
			if (livingNeighbors < 2 || livingNeighbors > 3) {
				cells[num] = false;
			} else if (livingNeighbors === 3) {
				cells[num] = true;
			}
		}
		this.setState({ cells, generation });
	}

	adjustTemperature() {
		clearInterval(this.state.timer);
		const quicken = this.state.changeSpeed === "Speed Up";
		this.setState({
			changeSpeed: quicken ? "Slow Down" : "Speed Up",
			timer: setInterval(this.handOfFate, quicken ? 100 : 1000),
		});
	}

	clearBoard() {
		let { timer, gamePlay } = this.state;
		if (gamePlay) {
			clearInterval(timer);
		} else {
			timer = setInterval(this.handOfFate, 100);
		}
		this.setState({
			cells: Array(150).fill(false),
			timer,
			gamePlay: !gamePlay,
			generation: 0,
			gamePlay: false,
			changeSpeed: "Slow Down",
		});
	}

	componentDidMount() {
		let cells = [];
		for (let i = 0; i < 150; i++) {
			cells.push(Math.random() < 0.5);
		}
		this.setState({
			cells,
			generation: 0,
			gamePlay: true,
			changeSpeed: "Slow Down",
			timer: setInterval(this.handOfFate, 100),
		});
	}

	render() {
		const { changeSpeed } = this.state;
		const gamePlay = this.state.gamePlay ? "Stop" : "Start";
		return (
			<div>
				<div id="tissue">{this.createTissue()}</div>
				<div id="buttons">
					<div>Generation: {this.state.generation}</div>
					<div onClick={this.handOfFate}>{gamePlay}</div>
					<div onClick={this.adjustTemperature}>{changeSpeed}</div>
					<div onClick={this.clearBoard}>Clear Board</div>
				</div>
			</div>
		);
	}
}
