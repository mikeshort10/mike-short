import { moveSwitch } from "./moveSwitch";
import { boardIndex } from "./boardSetup";

export const enemyMove = function(enemyNum, board, player, enemies) {
	let enemy = { ...enemies[enemyNum] };
	let newIndex,
		destination,
		destinationCode = "";
	let index = (newIndex = enemy.position);
	if (!enemy.attack) {
		const code = 37 + Math.floor(Math.random() * 4);
		newIndex = moveSwitch(code, index);
		if (!board[newIndex].playable || board[newIndex].player === "book") {
			newIndex = index;
		}
	} else {
		const [pCC, eCC] = [player.checkpointCode, enemy.checkpointCode];
		if (pCC === eCC) {
			[destination, destinationCode] = [player.position, pCC];
		} else {
			let i = 0;
			while (eCC[i] && pCC[i] === eCC[i]) {
				destinationCode += eCC[i++];
			}
			if (index === enemy.lastCheckpoint) {
				if (destinationCode === eCC || destinationCode === "") {
					destinationCode += pCC[i];
				} else {
					destinationCode = destinationCode.slice(
						0,
						destinationCode.length - 1,
					);
				}
			}
			if (destinationCode === "") {
				destinationCode = pCC[0];
			}
			destination = this.findCheckpoint(destinationCode);
		}
		enemy.checkpoint = destination;
		enemy.checkpointCode = destinationCode;
		const [rDiff, cDiff] = [
			Math.floor((index - destination) / boardIndex(1, 0)),
			(index - destination) / boardIndex(1, 0),
		]; // continue work
		const upDown = rDiff / Math.abs(rDiff ? rDiff : 1);
		const leftRight = cDiff / Math.abs(cDiff ? cDiff : 1);
		const spaceX = board[index - leftRight];
		const spaceY = board[index - boardIndex(upDown, 0)];
		const altSpaceX = board[index + leftRight];
		const altSpaceY = board[index + boardIndex(upDown, 0)];
		if (Math.abs(rDiff) >= Math.abs(cDiff) && rDiff !== 0) {
			if (spaceY.playable) {
				newIndex = spaceY;
			} else if (spaceX && spaceX.playable) {
				newIndex = spaceX;
			} else if (altSpaceX && altSpaceX.playable) {
				newIndex = altSpaceX;
			}
		} else {
			if (spaceX.playable) {
				newIndex = spaceY;
			} else if (spaceY && spaceY.playable) {
				newIndex = spaceY;
			} else if (altSpaceY && altSpaceY.playable) {
				newIndex = altSpaceY;
			}
		}
	}
	let newEnemy = board[newIndex];
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
		delete board[index].player;
		board[index].playable = true;
		newEnemy.player = enemy.player;
		newEnemy.playable = false;
		enemy.position = newIndex;
		if (
			!newEnemy.darkness &&
			!this.state.abilities.cloaked &&
			!this.state.testMode
		)
			enemy.attack = true;
	}
};
