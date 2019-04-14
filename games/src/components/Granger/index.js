import React, { Component } from 'react';
import './style.css';
import { checkpoints } from './JSON/checkpoints.json';
import lumos from './functions/lumos';
import Begin from './components/Begin';
import Instructions from './components/Instructions';
import Settings from './components/Settings';
import Play from './components/Play';
import Lose from './components/Lose';
import win from './functions/win';
import move from './functions/playerMove';
import enemyMove from './functions/enemyMove';
import { moveEnemies, boardSetup} from './functions/boardSetup';
import generateVillian from './functions/generateVillian';

//As I level up, my attack changes
//directions for cloak
//directions for lumos
//directions for book
//I can move on to level 2 😱

class Granger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "play",
      codeArr: [],
      attacking: false,
      numOfEnemies: 12,
      enemyType: "hufflepuff",
      modal: 0,
      player: {
        level: 1
      },
      abilities: {

      },
      modalText: [
        {
          title: "",
          body: ""
        },
        {
          title: "Where'd you go?!",
          body: `You've discovered that the cloak you're wearing is the legendary
          invisibility cloak! While under your cloak, spaces will appear blue, and
          enemies cannot see you unless you run into them!`
        },
        {
          title: "Who turned on the light?",
          body: `With all this practice, you're able to perform lumos! Now you can
          see twice the distance! Be careful though: your cloak won't work while you're
          casting the lumos spell. Press " + <i className="fa fa-stop-button"/> + " to
          toggle the spell.`
        },
        {
          title: "The Imperious Counter-Curse!",
          body: `You've discovered the Imperius Countercurse! Now all that's left to do
          is to find where the Death Eater is hidden in the castle.`
        }
      ],
      testMode: true,
      noBots: false
    };
    this.move = move.bind(this);
    this.win = win.bind(this);
    this.lumos = lumos.bind(this);
    this.generateVillian = generateVillian.bind(this);
    this.enemyMove = enemyMove.bind(this);
    this.boardSetup = boardSetup.bind(this);
    this.moveEnemies = moveEnemies.bind(this);
  }

  determineCheckpoint = (player, lastSpace, currentSpace) => {
    let [ coords, lastCheckpoint ] = [ player.lastCheckpoint, player.checkpointCode ];
    let currentCode = currentSpace.checkpoint;
    if (currentCode !== undefined && lastSpace.checkpoint === currentCode && lastSpace.toCenter !== currentSpace.toCenter) {
      lastCheckpoint = lastSpace.toCenter || currentCode.length === 1 ? currentCode : currentSpace.checkpoint.substr(0, currentCode.length - 1);
      coords = this.findCheckpoint(lastCheckpoint);
    }
    return [coords, lastCheckpoint];
  }

  findCheckpoint = (str, q, route = checkpoints) => {
    if (str.length === 1) {
      return q ? route[str].q[0] : route[str].p[0];
    }
    let newRoute = route[str[0]];
    let slicedString = str.substr(1);
    return this.findCheckpoint(slicedString, q, newRoute);
  }

  bossMove = () => {
    const board = {...this.state.board};
    const boss = {...this.state.boss};
    const player = { ...this.state.player };
    const oldBoss = board[boss.position[0]][boss.position[1]];
    const attack = Math.floor(Math.random() * 4) + boss.baseAttack;
    do {
      var row = Math.floor(Math.random() * 7) + 15;
      var column = Math.floor(Math.random() * 6) + 44;
      var newBoss = board[row][column];
    } while ( newBoss.playable === false || (row === 15 && column === 44) || newBoss.player);
    delete oldBoss.player;
    oldBoss.playable = true;
    newBoss.player = "boss";
    newBoss.playable = false;
    boss.position = [row, column];
    player.HP = player.HP > attack ? player.HP - attack : 0;
    this.setState({ boss, board, player }, this.win );
  }

  alohomora = (board) => {
    delete board[23][46].player;
    board[23][46].playable = true;
    return board;
  }

  keyup = (code) => {
    if (code.keyCode === 65) {
      this.setState({ attacking: false });
    } else if (code.keyCode > 36 && code.keyCode < 41) {
      this.setState({ playerDirection: undefined });
    }
  }

  toggleLights = (code) => {
    if (code.keyCode !== 32 && code !== 32) return;
    let abilities = {...this.state.abilities};
    if (abilities.lumosPlus) {
      let board = {...this.state.board};
      let [ playerRow, playerCol ] = this.state.player.position;
      abilities.lumosToggle = !abilities.lumosToggle;
      function luminate(row, column) {
        [ row, column ] = [ playerRow + row, playerCol + column ];
        board[row][column].darkness = !board[row][column].darkness;
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

  generateCheckpoints = (board) => {
    function iterateCheckpointArray(key, pQ, toCenter) {
      for (let i = 0; i < pQ.length; i++) {
        let [ row, column ] = pQ[i];
        board[row][column].checkpoint = key.s;
        board[row][column].toCenter = toCenter;
      }
    }
    function recurThruCheckpoints(cp = checkpoints, str = "") {
      let arr = [];
      for (let i = 0; cp[i]; i++) {
        cp[i].s = str + i;
        arr.push(cp[i].s);
        iterateCheckpointArray(cp[i], cp[i].p, true);
        iterateCheckpointArray(cp[i], cp[i].q, false);
        // .concat necessary for recursion
        if (cp[i][0]) arr = arr.concat(recurThruCheckpoints(cp[i], cp[i].s));
      }
      return arr;
    }
    return recurThruCheckpoints();
  }

  randomSpace = (board, player, num) => {
    for (let i = 0; i < num; i++) {
      do {
        var row = Math.floor(Math.random() * 50);
        var column = Math.floor(Math.random() * 50);
        var space = board[row][column];
      } while (!space.playable || space.player || (row > 20 && row < 32) || (column > 20 && column < 32));
      space.player = player;
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.move, false);
    document.addEventListener("keypress", this.toggleLights, false);
    document.addEventListener("keyup", this.keyup, false);
    document.getElementsByTagName('body')[0].setAttribute('class','lindsay-granger');
    this.boardSetup();
  }

  changeStatus = (status) => {
    this.setState({ status }, () => { if (status === "play") this.boardSetup(); });
  }

  changeState = (key, val) => {
    const state = {...this.state}
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
                playerLevel={ this.state.player.level }
                playerXP={ this.state.player.XP }
                playerHP={ this.state.player.HP }
                playerAttack={ this.state.player.attack }
                playerMaxHP={ this.state.player.maxHP }
                board={ this.state.board } />);
      case "...lose":
        return (<Lose 
                status={this.state.status}
                changeStatus={this.state.changeStatus}
                />)
      default:
        return;
    }
  }
}

export default Granger;