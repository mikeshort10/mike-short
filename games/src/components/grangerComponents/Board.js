import React from 'react';
import Space from './Space';

function Board (props) {
	let board = props.board;
	let isCloaked = props.abilities.cloaked ? "board-cloaked" : "board";

	function createBoard() {
		let arr = [];
		for (let row in board) {
		  for (let column in board[row]) {
			arr.push(
			  <Space
				space={board[row][column]}
				abilities={props.abilities} />
			);
		  }
		}
		return arr;
	}

	return <div id={isCloaked}> {createBoard()} </div>
}

export default Board;