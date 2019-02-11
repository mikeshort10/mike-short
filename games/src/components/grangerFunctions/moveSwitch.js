function moveSwitch (code, rowToChange, columnToChange) {
    switch (code) {
      case 37:
        columnToChange--;
        break;
      case 38:
        rowToChange--;
        break;
      case 39:
        columnToChange++;
        break;
      case 40:
        rowToChange++;
        break;
      default:
        break;
    }
    return [rowToChange, columnToChange];
  }

export default moveSwitch;