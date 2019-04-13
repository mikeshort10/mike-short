function enemyMove (enemyNum) {
	let { board, player, enemies, playerHP } = {...this.state};
	let enemy = enemies[enemyNum];
	let row, column, newRow, newCol, destination, destinationCode;
	[row, column] = [ newRow, newRow ] = enemy.position;
	if (!enemy.attack) {
		// if enemy is not on the offensive, move in a random direction
		const code = Math.floor(Math.random() * 4) + 37;
		const newPosition = this.moveSwitch(code, newRow, newCol);
		const space = board[newPosition[0]][newPosition[1]];
		if (space.playable && space.player !== "book") {
			// if space is available, set up enemy to move there
			[ newRow, newCol ] = newPosition;
	  	}
	} else {
		// if enemy is on the offensive
		const [pCC, eCC] = [player.checkpointCode, enemy.checkpointCode];
		if (pCC === eCC) {
			// if player's and enemy's last checkpoint code is the same, set enemy to move to player's space
			[ destination, destinationCode ] = [ player.position, pCC ];
		} else {
			// else, continue moving toward player's last checkpoint
			let commonCode = "";
			for (let i = 0; i < Math.min(eCC.length, pCC.length); i++) {
				// while i is less than the shorter checkpoint code (i.e. the one closer to the center)
				// add then next digit to the commonCode
				commonCode += eCC[i];
				if (pCC[i] !== eCC[i] || eCC[i] === undefined) {
					// if we come across a difference in codes, that's where the enemy is should go
					break;
				}
			}
			if (commonCode.length === eCC.length) {
				// if 
				destinationCode = pCC.substring(0, eCC.length + 1);
			} else {
				destinationCode = eCC.substring(0, eCC.length - 1);
			} 
			destination = this.findCheckpoint(destinationCode);
			if (row === destination[0] && column === destination[1]) {
				enemy.lastCheckpoint = destination;
				enemy.checkpointCode = destinationCode;
				if (commonCode.length === eCC.length) {
					destination = pCC.substring(0, eCC.length + 2)
				} else {
					destination = eCC.substring(0, eCC.length - 2);
				}
				if (!destinationCode) destinationCode = pCC[0];
				destination = this.findCheckpoint(destinationCode);
			}
		}
		let [ rDiff, cDiff ] = [ row - destination[0], column - destination[1] ];
		let upDown = rDiff ? rDiff / Math.abs(rDiff) : 0;
		let leftRight = cDiff ? cDiff / Math.abs(cDiff) : 0;
		let [ newRow, newColumn ] = [ row - upDown, column - leftRight ];
		[ newRow, newCol ] = [ row, column ];
		if (Math.abs(rDiff) >= Math.abs(cDiff)) {
			if (!board[newRow][column].playable) {
				if (!leftRight) {
					let space = board[row][column - 1];
					( space && space.playable ) ? newCol-- : newCol++
				} else if (board[row][newColumn].playable) {
					newCol = newColumn;
				}
			} 
		} else {
			if (board[row][newColumn].playable) newCol = newColumn;
			else if (!upDown) {
				let space = board[row - 1][column];
				(space && space.playable) ? newRow-- : newRow++;
			}
		}
	}
	let formerEnemy = board[row][column];
	let newEnemy = board[newRow][newCol];
	if (newEnemy.player === "wand" || newEnemy.player === "potion") {
		this.randomSpace(board, newEnemy.player, 1);
	} else if (newEnemy.player === "player") {
		if (!enemy.attack) {
			enemy.attack = true;
		} else {
			let damage =  Math.ceil(Math.random() * 4 + enemy.baseAttack);
			playerHP -= (playerHP - damage > 0) ? playerHP : 0;
		}
	} else {
		delete formerEnemy.player;
		formerEnemy.playable = true;
		newEnemy.player = enemy.player;
		newEnemy.playable = false;
		if (!newEnemy.darkness && !this.state.abilities.cloaked && !this.state.testMode) 
			enemy.attack = true;
		enemy.position = [newRow, newCol];
		if (destination === undefined) {
			let checkpoint = this.determineCheckpoint(enemy, formerEnemy, newEnemy);
			[enemy.lastCheckpoint, enemy.checkpointCode] = checkpoint;
		}
	}
	this.setState({ board, enemies, playerHP }, this.win);
  }

  export default enemyMove;