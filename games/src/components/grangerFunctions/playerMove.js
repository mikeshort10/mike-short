import moveSwitch from './moveSwitch';

export default function move (code) {
    if (typeof code !== "number") code = window.event.keyCode;
    if ((code < 37 || code > 40) && code !== 65) return;
    let board = {...this.state.board };
    const player = {...this.state.player};
    const enemies = {...this.state.enemies};
    let abilities = {...this.state.abilities};
    const boss = {...this.state.boss};
    const { playerDirection, checkpointCodes, attacking } = this.state;
    let { XP, HP, maxHP, level } = this.state.player;
    let modal = 0;
    let newPosition = moveSwitch(code !== 65 ? code : playerDirection, ...player.position);
    let [ nextRow, nextCol ] = newPosition;
    const nextSpace = board[ nextRow ][ nextCol ];
    if (nextSpace.player === "hufflepuff" || nextSpace.player === "ravenclaw" || nextSpace.player === "slytherin" || nextSpace.player === "boss") {
      let key;
      let attack = Math.floor(Math.random() * player.randomLimit + player.baseAttack);
      for (let k in enemies) {
        let e = enemies[k].position;
        if ( e[0] === nextRow && e[1] === nextCol ) {
          enemies[k].attack = true;
          key = k;
          break;
        }
      }
      if (code === 65 && playerDirection && !attacking) {
        if (nextSpace.player === "boss") {
          boss.HP -= attack;
        } else {
          enemies[key].HP -= attack;
          if (enemies[key].HP <= 0) {
            delete nextSpace.player;
            nextSpace.playable = true;
            XP += enemies[key].playerXP;
            const newVillian = enemies[key].player === "hufflepuff" ? "ravenclaw" : "slytherin";
            enemies[key] = this.generateVillian(checkpointCodes, board, newVillian);
          }
        }
      }
    } else if (code !== 65 && nextSpace.playable) {
      let lastSpace = board[player.position[0]][player.position[1]];
      [ player.lastCheckpoint, player.checkpointCode ] = this.determineCheckpoint(player, lastSpace,  nextSpace);
      delete lastSpace.player;
      if ( nextSpace.row === 23 && nextSpace.column === 47) {
        // if you make it into the boss's lair, the door shuts behind you
        board[23][46].playable = false;
        boss.timer = setInterval(() => this.bossMove(), 2000);
        clearInterval(this.state.timer.id);
      }
      if ( nextSpace.player === "wand") {
        XP += 10;
      } else if ( nextSpace.player === "potion") {
        HP + 10 > maxHP ? (HP = maxHP) : (HP += 10);
        this.randomSpace(board,  nextSpace.player, 1);
      } else if ( nextSpace.player === "book") {
        modal = 3;
        abilities.alohomora = true;
        board = this.alohomora(board);
      }
      if ((level + 1) * 10 <= XP) {
        XP -= ++level * 10;
        maxHP += 10;
        HP += 10;
        player.baseAttack += 2;
        if (this.state.player.level !== level) {
          if (level === 3) {
            modal = 1;
            abilities = {...abilities, hasCloak: true, cloaked: true}
          } else if (level === 5) {
            modal = 2;
            abilities.lumosPlus = true;
          }
        }
      }
      nextSpace.darkness = false;
      nextSpace.player = "player";
      board = this.lumos(code, board, nextRow , nextCol, abilities.lumosPlus);
      player.position = [ nextRow , nextCol ];
    }
    this.setState({ modal, board, boss, enemies, abilities,
        player: {...player, XP, HP, maxHP, level},
      	playerDirection: code !== 65 ? code : this.state.playerDirection,
        attacking: code === 65 ? true : this.state.attacking
      }, this.win);
  }