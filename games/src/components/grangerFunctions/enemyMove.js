import React from 'react';
const { checkpoints } = require('./../grangerJSON/checkpoints.json');

function enemyMove (enemyNum) {
    let board = { ...this.state.board };
    let player = { ...this.state.player };
    let playerHP = this.state.playerHP;
    let enemies = { ...this.state.enemies };
    let enemy = enemies[enemyNum];
    let row = enemy.position[0];
    let column = enemy.position[1];
    let bRow = board[row];
    let testRow, testCol, destination, destinationCode;
    if (!enemy.attack) {
      [ testRow, testCol ] = [ row, column ];
      let code = Math.floor(Math.random() * 4) + 37;
      let newPosition = this.moveSwitch(code, testRow, testCol);
      if (
        board[newPosition[0]][newPosition[1]].playable &&
        board[newPosition[0]][newPosition[1]].player !== "book"
      ) [ testRow, testCol ] = [ newPosition[0], newPosition[1] ];
    } else {
      let [ pCC, eCC ] = [ player.checkpointCode, enemy.checkpointCode ];
      if (pCC === eCC) [ destination, destinationCode ] = [ player.position, pCC ];
      else {
        let commonCode = "";
        let shortestCode = eCC.length > pCC.length ? pCC.length : eCC.length;
        for (let i = 0; i < shortestCode; i++) {
          commonCode += eCC[i];
          if (pCC[i] !== eCC[i] || eCC[i] === undefined) break;
        }
        destinationCode =
          commonCode.length === eCC.length
            ? pCC.substring(0, eCC.length + 1)
            : eCC.substring(0, eCC.length - 1);
        destination = this.findCheckpoint(checkpoints, destinationCode);
        if (row === destination[0] && column === destination[1]) {
          enemy.lastCheckpoint = destination;
          enemy.checkpointCode = destinationCode;
          destinationCode =
            commonCode.length === eCC.length
              ? pCC.substring(0, eCC.length + 2)
              : eCC.substring(0, eCC.length - 2);
          if (!destinationCode) destinationCode = pCC[0];
          destination = this.findCheckpoint(checkpoints, destinationCode);
        }
      }

      let [ rDiff, cDiff ] = [ row - destination[0], column - destination[1] ];
      let upDown = rDiff ? rDiff / Math.abs(rDiff) : 0;
      let leftRight = cDiff ? cDiff / Math.abs(cDiff) : 0;
      let [ newRow, newColumn ] = [ row - upDown, column - leftRight ];
      [ testRow, testCol ] = [ row, column ];

      if (Math.abs(rDiff) >= Math.abs(cDiff)) {
        if (board[newRow][column].playable) testRow = newRow;
        else if (!leftRight)
          bRow[column - 1] && bRow[column - 1].playable ? testCol-- : testCol++;
        else if (board[row][newColumn].playable) testCol = newColumn;
      } else {
        if (bRow[newColumn].playable) testCol = newColumn;
        else if (!upDown)
          board[row - 1][column] && board[row - 1][column].playable
            ? testRow--
            : testRow++;
        else if (board[newRow][column].playable) testRow = newRow;
      }
    }

    let formerEnemy = bRow[column];
    let newEnemy = board[testRow][testCol];
    if (newEnemy.player === "wand" || newEnemy.player === "potion")
      this.randomSpace(board, newEnemy.player, 1);
    if (newEnemy.player === "player") {
      if (enemy.attack) playerHP -= Math.ceil(Math.random() * 4 + enemy.baseAttack);
      else enemy.attack = true;
    } else {
      delete formerEnemy.player;
      formerEnemy.playable = true;
      newEnemy.player = enemy.player;
      newEnemy.playable = false;
      if (
        !newEnemy.darkness &&
        !this.state.abilities.cloaked &&
        !this.state.testMode
      ) enemy.attack = true;
      enemy.position = [testRow, testCol];
      if (destination === undefined) {
        let checkpoint = this.determineCheckpoint(enemy, formerEnemy, newEnemy);
        enemy.lastCheckpoint = checkpoint[0];
        enemy.checkpointCode = checkpoint[1];
      }
    }
    this.setState({
        board,
        enemies,
        playerHP: playerHP < 0 ? 0 : playerHP
      }, this.win
    );
  }

  export default enemyMove;