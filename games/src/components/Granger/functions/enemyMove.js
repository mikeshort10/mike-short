import moveSwitch from './moveSwitch';

export default function enemyMove (enemyNum, board, player, enemies) {
	let enemy = enemies[enemyNum];
	let newRow, newCol, destination, destinationCode = "";
	let [row, column] = [ newRow, newCol ] = enemy.position;
	if (!enemy.attack) {
		const code = 37 + Math.floor(Math.random() * 4);
		[ newRow, newCol ] = moveSwitch(code, row, column);
		if (!board[newRow][newCol].playable || board[newRow][newCol].player === "book") {
			[ newRow, newCol ] = [row, column];
	  	}
	} else {
		const [pCC, eCC] = [player.checkpointCode, enemy.checkpointCode];
		console.log(pCC, eCC);
		if (pCC === eCC) {
			[ destination, destinationCode ] = [ [...player.position], pCC ];
		} else {
			let i = 0;
			while (eCC[i] && pCC[i] === eCC[i]) {
				destinationCode += eCC[i++];
			}
			if (row === enemy.lastCheckpoint[0] && column === enemy.lastCheckpoint[1]) {
				if (destinationCode === eCC || destinationCode === "") {
					destinationCode += pCC[i];
				} else {
					destinationCode = destinationCode.slice(0, destinationCode.length - 1);
				} 
			} 
			if (destinationCode === "") {
				destinationCode = pCC[0];
			}
			destination = this.findCheckpoint(destinationCode);
		}
		enemy.checkpoint = destination;
		enemy.checkpointCode = destinationCode;
		const [ rDiff, cDiff ] = [ row - destination[0], column - destination[1] ];
		const upDown = rDiff / Math.abs(rDiff ? rDiff : 1);
		const leftRight = cDiff / Math.abs(cDiff ? cDiff : 1);
		const spaceX = board[row][column - leftRight];
		const spaceY = board[row - upDown][column];
		const altSpaceX = board[row][column + leftRight];
		const altSpaceY = board[row + upDown][column];
		if (Math.abs(rDiff) >= Math.abs(cDiff) && rDiff !== 0) {
			if ( spaceY.playable ) {
				newRow -= upDown;
			} else if ( spaceX && spaceX.playable ) {
				newCol -= leftRight;
			} else if ( altSpaceX && altSpaceX.playable ) {
				newCol += leftRight;
			}
		} else {
			if ( spaceX.playable ) {
				newCol -= leftRight;
			} else if ( spaceY && spaceY.playable ) {
				newRow -=  upDown;
			} else if ( altSpaceY && altSpaceY.playable ) {
				newRow += upDown;
			}
		}
	}
	let newEnemy = board[newRow][newCol];
	if (newEnemy.player === "player") {
		if (!enemy.attack) {
			enemy.attack = true;
		} else {
			let damage = Math.ceil(Math.random() * 4 + enemy.baseAttack);
			player.HP -= Math.max(player.HP - damage, 0);
		}
	} else {
		if (newEnemy.player === "wand" || newEnemy.player === "potion") {
			this.randomSpace(board, newEnemy.player, 1);
		}
		delete board[row][column].player;
		board[row][column].playable = true;
		newEnemy.player = enemy.player;
		newEnemy.playable = false;
		enemy.position = [newRow, newCol];
		if (!newEnemy.darkness && !this.state.abilities.cloaked && !this.state.testMode) 
			enemy.attack = true;
	}
  }