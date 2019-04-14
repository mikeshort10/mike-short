export default function generateVillian (cpCodes, board, player) {
    let index, code;
    do {
      index = Math.floor(Math.random() * cpCodes.length);
      code = cpCodes[index];
    } while (code.length < 2 || index === cpCodes.length - 1);
    const [ row, column ] = (player === "boss") ? [24, 51] : this.findCheckpoint(code, true);
    board[row][column].player = player;
    board[row][column].playable = false;
    const baseEnemy = {
      position: [row, column],
      attack: false,
      player,
      lastCheckpoint: [row, column],
      checkpointCode: board[row][column].checkpoint
    }
    switch (player) {
      case "hufflepuff":
        return {
          ...baseEnemy,
          HP: 20,
          XP: 15,
          baseAttack: 6
        }
      case "ravenclaw":
        return {
          ...baseEnemy,
          HP: 30,
          XP: 20,
          baseAttack: 10
        }
      case "slytherin":
        return {
          ...baseEnemy,
          HP: 50,
          XP: 35,
          baseAttack: 15
        }
      case "boss":
        return {
          ...baseEnemy,
          HP: 9 * this.state.numOfEnemies,
          XP: 100,
          baseAttack: this.state.numOfEnemies
        }
      default:
        return;
    }
  }