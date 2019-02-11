import React, { Component } from 'react';
import './Granger.css';
import Board from './grangerComponents/Board';
import Stats from './grangerComponents/Stats';
import { obstacles } from './grangerJSON/obstacles.json';
import { checkpoints } from './grangerJSON/checkpoints.json';
import lumos from './grangerFunctions/lumos';
import Begin from './grangerComponents/Begin';
import Instructions from './grangerComponents/Instructions';
import Settings from './grangerComponents/Settings';
import Play from './grangerComponents/Play';
import Lose from './grangerComponents/Lose';
import win from './grangerFunctions/win';
import move from './grangerFunctions/playerMove';
import moveSwitch from './grangerFunctions/moveSwitch';
import enemyMove from './grangerFunctions/enemyMove';
import boardSetup from './grangerFunctions/boardSetup';
import generateVillian from './grangerFunctions/generateVillian';

//As I level up, my attack changes
//directions for cloak
//directions for lumos
//directions for book
//I can move on to level 2 😱

class Granger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "begin",
      codeArr: [],
      playerDirection: undefined,
      attacking: false,
      playerLevel: 1,
      playerHP: 30,
      playerMaxHP: 30,
      playerXP: 0,
      abilities: {
        cloaked: false,
        lumosPlus: false,
        elderWand: false,
        lumosToggle: false,
        alohomora: false
      },
      playerAttack: "Stupify",
      numOfEnemies: 12,
      enemyType: "hufflepuff",
      modal: 0,
      modalText: [
        {
          title: "",
          body: ""
        },
        {
          title: "Where'd you go?!",
          body: "You've discovered that the cloak you're wearing is the legendary \
          invisibility cloak! While under your cloak, spaces will appear blue, and \
          enemies cannot see you unless you run into them!"
        },
        {
          title: "Who turned on the light?",
          body: "With all this practice, you're able to perform lumos! Now you can \
          see twice the distance! Be careful though: your cloak won't work while you're \
          casting the lumos spell. Press " + <i className="fa fa-stop-button"/> + " to \
          toggle the spell."
        },
        {
          title: "The Imperious Counter-Curse!",
          body: "You've discovered the Imperius Countercurse! Now all that's left to do \
          is to find where the Death Eater is hidden in the castle."
        }
      ],
      testMode: false,
      noBots: false
    };
    this.move = move.bind(this);
    this.win = win.bind(this);
    this.lumos = lumos.bind(this);
    this.toggleLights = this.toggleLights.bind(this);
    this.generateCheckpoints = this.generateCheckpoints.bind(this);
    this.generateVillian = generateVillian.bind(this);
    this.findCheckpoint = this.findCheckpoint.bind(this);
    this.keyup = this.keyup.bind(this);
    this.enemyMove = enemyMove.bind(this);
    this.boardSetup = boardSetup.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.moveSwitch = moveSwitch.bind(this);
  }

  determineCheckpoint(player, lastSpace, currentSpace) {
    let lastCheckpoint = player.checkpointCode;
    let coords = player.lastCheckpoint;
    let code = currentSpace.checkpoint;
    let lastDirection = lastSpace.toCenter;
    let currDirection = currentSpace.toCenter;
    if (
      code !== undefined &&
      lastSpace.checkpoint === code &&
      lastDirection !== currDirection
    ) {
      lastCheckpoint =
        lastDirection || code.length === 1 ? code : code.substr(0, code.length - 1);
      coords = this.findCheckpoint(checkpoints, lastCheckpoint);
    }
    return [coords, lastCheckpoint];
  }

  findCheckpoint(route, str, q) {
    if (str.length === 1) {
      if (q) return route[str].q[0];
      else return route[str].p[0];
    }
    let newRoute = route[str[0]];
    let slicedString = str.substr(1);
    return this.findCheckpoint(newRoute, slicedString, q);
  }

  bossMove() {
    let board = Object.assign({}, this.state.board);
    let boss = Object.assign({}, this.state.boss);
    let oldBoss = board[boss.position[0]][boss.position[1]];
    let attack = Math.floor(Math.random() * 4) + boss.baseAttack;
    let row, column, newBoss;
    do {
      row = Math.floor(Math.random() * 7) + 15;
      column = Math.floor(Math.random() * 6) + 44;
      newBoss = board[row][column];
    } while (
      newBoss.playable === false ||
      (row === 15 && column === 44) ||
      newBoss.player
    );
    delete oldBoss.player;
    oldBoss.playable = true;
    newBoss.player = "boss";
    newBoss.playable = false;
    boss.position = [row, column];

    this.setState({
        boss, board,
        playerHP: this.state.playerHP < attack ? 0 : this.state.playerHP - attack
      }, this.win );
  }

  alohomora(board) {
    delete board[23][46].player;
    board[23][46].playable = true;
    return board;
  }

  keyup(code) {
    code = code.keyCode;
    if (code === 65) this.setState({ attacking: false });
    else if (code > 36 && code < 41) this.setState({ playerDirection: undefined });
  }

  toggleLights(code) {
    if (code.keyCode !== 32 && code !== 32) return;
    let abilities = Object.assign({}, this.state.abilities);
    if (abilities.lumosPlus) {
      let board = Object.assign({}, this.state.board);
      let playerRow = this.state.player.position[0];
      let playerCol = this.state.player.position[1];
      abilities.lumosToggle = !abilities.lumosToggle;
      function luminate(row, column) {
        row = board[playerRow + row];
        column = playerCol + column;
        row[column].darkness = !row[column].darkness;
      }
      for (let i = -2; i <= 2; i++) {
        luminate(2, i);
        luminate(i, 2);
        luminate(-2, i);
        luminate(i, -2);
      }
      if (abilities.lumosToggle) abilities.cloaked = false;
      else if (abilities.hasCloak) abilities.cloaked = true;
      this.setState({ abilities, board });
    }
  }

  generateCheckpoints(board) {
    function iterateCheckpointArray(key, pQ, toCenter) {
      for (let i = 0; i < pQ.length; i++) {
        let row = pQ[i][0];
        let column = pQ[i][1];
        board[row][column].checkpoint = key.s;
        board[row][column].toCenter = toCenter;
      }
    }

    function recurThruCheckpoints(cp, str) {
      let arr = [];
      str = str || "";
      for (let i = 0; cp[i]; i++) {
        cp[i].s = str + i;
        arr = arr.concat(str + i);
        iterateCheckpointArray(cp[i], cp[i].p, true);
        iterateCheckpointArray(cp[i], cp[i].q, false);
        if (cp[i][0]) arr = arr.concat(recurThruCheckpoints(cp[i], str + i));
      }
      return arr;
    }
    return recurThruCheckpoints(checkpoints);
  }

  randomSpace(board, player, num) {
    for (let i = 0; i < num; i++) {
      do {
        var row = Math.floor(Math.random() * 50);
        var column = Math.floor(Math.random() * 50);
        var space = board[row][column];
      } while (
        !space.playable ||
        space.player ||
        (row > 20 && row < 32) ||
        (column > 20 && column < 32)
      );
      space.player = player;
    }
    return [row, column];
  }

  componentDidMount() {
    if (this.state.status === "play") this.boardSetup();
  }

  changeStatus(status) {
    this.setState({ status: status }, () => {
      if (status === "play") this.boardSetup();
    });
  }

  changeState(key, val) {
    let state = Object.assign({}, this.state);
    state[key] = val;
    this.setState(state);
  }

  render() {
    switch (this.state.status) {
      case "begin":
        return <Begin changeStatus={this.changeStatus} />;
      case "instructions":
        return <Instructions changeStatus={this.changeStatus} />;
      case "select":
        return (<Settings 
                changeState={this.changeState} 
                changeStatus={this.changeStatus} 
                enemyType={this.state.enemyType} 
                numOfEnemies={this.state.numOfEnemies}/>);
      case "play":
        return (<Play 
                modal={ this.state.modal }
                modalText={ this.state.modalText }
                setState={ this.setState }
                abilities={ this.state.abilities }
                playerLevel={ this.state.playerLevel }
                playerXP={ this.state.playerXP }
                playerHP={ this.state.playerHP }
                playerAttack={ this.state.playerAttack }
                playerMaxHP={ this.state.playerMaxHP }
                board={ this.state.board } />);
      case "...lose":
        return (<Lose 
                status={this.state.status}
                changeStatus={this.state.changeStatus}
                />)
    }
  }
}

export default Granger;