const { checkpoints } = require('./../grangerJSON/checkpoints.json');

function generateVillian (cpCodes, board, villian) {
    do {
      var index = Math.floor(Math.random() * cpCodes.length);
      var code = cpCodes[index];
    } while (code.length < 2 || index === cpCodes.length - 1);
    let position =
      villian === "boss"
        ? [24, 51]
        : this.findCheckpoint(checkpoints, code, true);
    let row = position[0];
    let column = position[1];
    let HP, XP, baseAttack, moveSpeed;
    board[row][column].player = villian;
    board[row][column].playable = false;
    switch (villian) {
      case "hufflepuff":
        HP = 20;
        XP = 15;
        baseAttack = 6;
        moveSpeed = 1500;
        break;
      case "ravenclaw":
        HP = 30;
        XP = 20;
        baseAttack = 10;
        moveSpeed = 1000;
        break;
      case "slytherin":
        HP = 50;
        XP = 35;
        baseAttack = 15;
        moveSpeed = 500;
        break;
      case "boss":
        HP = 9 * this.state.numOfEnemies;
        XP = 100;
        baseAttack = this.state.numOfEnemies;
        moveSpeed = 2000;
        break;
      default:
        console.log("invalid villian");
        break;
    }
    return {
      position: [row, column],
      attack: false,
      HP: HP,
      XP: XP,
      baseAttack: baseAttack,
      moveSpeed: moveSpeed,
      player: villian,
      lastCheckpoint: [row, column],
      checkpointCode: board[row][column].checkpoint
    };
  }

export default generateVillian;