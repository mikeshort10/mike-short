function lumos (code, board, playerRow, playerCol, lumos) {
    const lumosToggle = this.state.abilities.lumosToggle; //when set to true, illuminates additional spaces
    const hide = !this.state.testMode; //when testMode set to true, entire board is visible
    let d = (lumos && lumosToggle) ? 3 : 2;//set limit of illumination distance

    //illuminates 8 surrounding Spaces
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const [ row, col ] = [ playerRow + i, playerCol + j ];
        board[row][col].darkness = false;
        if (lumos && lumosToggle) {
          for (let k = -1; k < 2; k++) {
            let [ kRow, kCol ] = [ k + row, k + col ];
            board[kRow][col].darkness = board[row][kCol].darkness = false;
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
    	let row = playerRow + r;
    	let col = playerCol + c;
    	if (board[row] && board[row][col]) {
        board[row][col].darkness = hide;
      }
    }
    for (let i = 1 - d; i < d; i++) {
      if (code === 37) dark(i, d);
      else if (code === 38) dark(d, i);
      else if (code === 39) dark(i, -d);
      else if (code === 40) dark(-d, i);
    }
    return board;
  }

  export default lumos;