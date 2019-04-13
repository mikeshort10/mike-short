const { obstacles } = require('./../grangerJSON/obstacles.json');

function boardSetup () {
    const board = {};
    const enemies = {};
    for (let i = 0; i < 54; i++) {
      board[i] = {};
      for (let j = 0; j < 54; j++) {
        board[i][j] = { row: i, column: j, playable: true, darkness: !this.state.testMode };
      }
    }
    obstacles.map((x, i) => obstacles[i].map(y => (board[i][y].playable = false)));
    board[36][48].player = "book";
    board[23][46].player = "door";
    board[28][28].player = "player";
    this.lumos(37, board, 28, 28);
    const checkpointCodes = this.generateCheckpoints(board);
    const boss = this.generateVillian(checkpointCodes, board, "boss");
    this.randomSpace(board, "wand", 12);
    this.randomSpace(board, "potion", 6);
    for (let i = 0; i < this.state.numOfEnemies; i++)
      enemies[i] = this.generateVillian(checkpointCodes, board, this.state.enemyType);
    for (let i = 0; i < enemies.length; i++)
      this.timers[i] = setInterval(() => this.enemyMove(i), enemies[i].moveSpeed);
    this.setState({
        board, boss, enemies, checkpointCodes,
        player: {
          position: [28, 28],
          lastCheckpoint: [23, 33],
          checkpointCode: "1",
          baseAttack: 6,
          randomLimit: 4,
          level: 1,
          HP: 30,
          maxHP: 30,
          XP: 0,
          attack: "Stupify"
        },
        abilities: {
          cloaked: false,
          lumosPlus: false,
          elderWand: false,
          lumosToggle: false,
          alohomora: false
        },
      }
    );
  }

  export default boardSetup;