import React from 'react';
import Space from './Space';
import './../Granger.css';

export default class Board extends React.Component {
	createBoard() {
		const board = this.props.board;
		let arr = [];
		for (let row in board) {
		  for (let column in board[row]) {
			arr.push(
			  <Space
				key = {row + " " + column}
				space={board[row][column]}
				abilities={this.props.abilities} />
			);
		  }
		}
		return arr;
	}
	render() {
		const isCloaked = this.props.abilities.cloaked ? "granger-board-cloaked" : "granger-board";
		return <div id={isCloaked}> {this.createBoard()} </div>
	}
}