function lumos (code, board, playerRow, playerCol, lumos) {
    let lumosToggle = this.state.abilities.lumosToggle; //when set to true, illuminates additional spaces
    let hide = !this.state.testMode; //when testMode set to true, entire board is visible
    let d = (lumos && lumosToggle) ? 3 : 2;//set limit of illumination distance

    //illuminates 8 surrounding Spaces
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let row = board[playerRow + i];
        let col = playerCol + j;
        row[col].darkness = false;
        if (lumos && lumosToggle) {
          for (let k = -1; k < 2; k++) {
            let kRow = board[playerRow + i + k];
            let kCol = col + k;
            kRow[col].darkness = false;
            row[kCol].darkness = false;
          }
        }
      }
    }

    /*if (lumos && lumosToggle) {
      let plusRow = board[playerRow + 2];
      let minusRow = board[playerRow - 2];
      let plusCol = playerCol + 2;
      let minusCol = playerCol - 2;
      if (plusRow && plusRow[plusCol]) plusRow[plusCol].darkness = hide;
      if (minusRow && minusRow[plusCol]) minusRow[plusCol].darkness = hide;
      if (plusRow && plusRow[minusCol]) plusRow[minusCol].darkness = hide;
      if (minusRow && minusRow[minusCol]) minusRow[minusCol].darkness = hide;
    }*/

    //if lumosPlus is an ability and lumosToggle is set to true,
    //deluminates all spaces that WERE two spaces from the player
    function dark (r, c) {
    	let row = board[playerRow + r];
    	let col = row[playerCol + c];
    	if (row && col) col.darkness = hide;
    }
    if (code === 37) for (let i = 1 - d; i < d; i++) dark(i, d);
    else if (code === 38) for (let i = 1 - d; i < d; i++) dark(d, i);
    else if (code === 39) for (let i = 1 - d; i < d; i++) dark(i, -d);
    else if (code === 40) for (let i = 1 - d; i < d; i++) dark(-d, i)

    return board;
  }

  export default lumos;