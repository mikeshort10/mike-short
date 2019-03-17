const { obstacles } = require('./../grangerJSON/obstacles.json');

function boardSetup () {
    let board = {};
    let boss;
    for (let i = 0; i < 54; i++) {
      board[i] = {};
      for (let j = 0; j < 54; j++) {
        board[i][j] = {
          row: i,
          column: j,
          playable: true,
          darkness: !this.state.testMode
        };
      }
    }
    board[28][28].player = "player";
    this.lumos(37, board, 28, 28);
    obstacles.forEach((x, i) => {
      obstacles[i].forEach(y => (board[i][y].playable = false));
    });
    let cpCodes = this.generateCheckpoints(board);
    boss = this.generateVillian(cpCodes, board, "boss");
    board[36][48].player = "book";
    this.randomSpace(board, "wand", 12);
    this.randomSpace(board, "potion", 6);
    board[23][46].player = "door";
    let enemies = {};
    let i = 0;
    for (i; i < this.state.numOfEnemies; i++)
      enemies[i] = this.generateVillian(cpCodes, board, this.state.enemyType);
    this.setState({
        board, boss, enemies,
        checkpointCodes: cpCodes,
        player: {
          position: [28, 28],
          lastCheckpoint: [23, 33],
          checkpointCode: "1",
          baseAttack: 6,
          randomLimit: 4
        },
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
        playerAttack: "Stupify"
      }, () => {
        document.addEventListener("keydown", this.move, false);
        document.addEventListener("keypress", this.toggleLights, false);
        document.addEventListener("keyup", this.keyup, false);
        let timers = {};
        let counter = 0;
        for (let i = 0; i < this.state.enemies.length; i++) counter++;
        for (let i = 0; i < counter; i++)
          timers[i] = setInterval(
            () => this.enemyMove(i),
            this.state.enemies[i].moveSpeed
          );
        this.setState({ timers: timers });
      }
    );
  }

  export default boardSetup;