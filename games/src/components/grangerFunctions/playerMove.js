import React from 'react';

function move (code) {
    if (typeof code !== "number") code = window.event.keyCode;
    if ((code < 37 || code > 40) && code !== 65) return;
    let board = { ...this.state.board };
    let player = { ...this.state.player };
    let enemies = { ...this.state.enemies };
    let abilities = { ...this.state.abilities };
    let timers = { ...this.state.timers };
    let boss = { ...this.state.boss };
    let XP = this.state.playerXP;
    let HP = this.state.playerHP;
    let playerMaxHP = this.state.playerMaxHP;
    let level = this.state.playerLevel;
    let levelUp = level * 10;
    let modal = 0;
    let newPosition;
    newPosition = this.moveSwitch(
      code !== 65 ? code : this.state.playerDirection,
      player.position[0],
      player.position[1]
    );
    let playerRow = newPosition[0];
    let playerCol = newPosition[1];
    let r = board[playerRow];
    if (
      r[playerCol].player === "hufflepuff" ||
      r[playerCol].player === "ravenclaw" ||
      r[playerCol].player === "slytherin" ||
      r[playerCol].player === "boss"
    ) {
      let key;
      let attack = Math.floor(
        Math.random() * player.randomLimit + player.baseAttack
      );
      for (let k in enemies) {
        let e = enemies[k].position;
        if (e[0] === playerRow && e[1] === playerCol) {
          enemies[k].attack = true;
          key = k;
          break;
        }
      }
      if (code === 65 && this.state.playerDirection && !this.state.attacking) {
        if (r[playerCol].player === "boss") boss.HP -= attack;
        else {
          enemies[key].HP -= attack;
          if (enemies[key].HP <= 0) {
            clearInterval(timers[key]);
            delete r[playerCol].player;
            r[playerCol].playable = true;
            XP += enemies[key].XP;
            let newVillian =
              enemies[key].player === "hufflepuff" ? "ravenclaw" : "slytherin";
            enemies[key] = this.generateVillian(
              this.state.checkpointCodes,
              board,
              newVillian
            );
            timers[key] = setInterval(
              () => this.enemyMove(key),
              enemies[key].moveSpeed
            );
          }
        }
      }
    } else if (code !== 65 && r[playerCol].playable) {
      let lastRow = board[this.state.player.position[0]];
      let lastCol = this.state.player.position[1];
      let lastSpace = lastRow[lastCol];
      let currentSpace = r[playerCol];
      let checkpoint = this.determineCheckpoint(player, lastSpace, currentSpace);
      player.lastCheckpoint = checkpoint[0];
      player.checkpointCode = checkpoint[1];
      delete lastSpace.player;
      if (currentSpace.row === 23 && currentSpace.column === 47) {
        board[23][46].playable = false;
        boss.timer = setInterval(() => this.bossMove(), boss.moveSpeed);
      }
      if (currentSpace.player === "wand") XP += 10;
      else if (currentSpace.player === "potion") {
        HP + 10 > playerMaxHP ? (HP = playerMaxHP) : (HP += 10);
        this.randomSpace(board, currentSpace.player, 1);
      }
      else if (currentSpace.player === "book") {
        modal = 3;
        abilities.alohomora = true;
        board = this.alohomora(board);
      }
      if (levelUp <= XP) {
        level++;
        XP -= levelUp;
        playerMaxHP += 10;
        HP += 10;
        player.baseAttack += 2;
        switch (level) {
          case 3:
            modal = 1;
            abilities.hasCloak = true;
            abilities.cloaked = true;
            break;
          case 5:
            modal = 2;
            abilities.lumosPlus = true;
            break;
          default:
            break;
        }
      }
      currentSpace.darkness = false;
      currentSpace.player = "player";
      board = this.lumos(code, board, playerRow, playerCol, abilities.lumosPlus);
      player.position = [playerRow, playerCol];
    }
    this.setState(
      { modal, board, player, boss, enemies, abilities, playerMaxHP, timers, 
      	playerlevel: level, 
      	playerXP: XP,
      	playerHP: HP,
      	playerDirection: code !== 65 ? code : this.state.playerDirection,
        attacking: code === 65 ? true : this.state.attacking
      },
      this.win
    );
  }

export default move;