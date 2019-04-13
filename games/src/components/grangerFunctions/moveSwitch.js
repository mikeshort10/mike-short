export default function moveSwitch (code, rowToChange, columnToChange) {
  switch (code) {
    case 37:
      return [rowToChange, --columnToChange];
    case 38:
      return [--rowToChange, columnToChange];
    case 39:
      return [rowToChange, ++columnToChange];
    case 40:
      return [++rowToChange, columnToChange];
    default:
      return;
  }
}