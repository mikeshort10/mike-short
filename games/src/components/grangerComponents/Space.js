import React from 'react';

function Space (props) {
  let space = props.space;
  let player = space.player;
  let row = space.row;
  let column = space.column;

  let spaceClass = () => {
    if (space.darkness) return "darkness";
    else if (!space.playable && (player === undefined || player === "door")) return "wall";
    else return "space";
  }

  let iconClass = () => {
    switch (player) {
      case "wand":
        return "fas fa-scroll wand";
      case "potion":
        return "fas fa-flask potion";
      case "boss":
        return "fas fa-skull boss";
      case "door":
        return "fas fa-lock door";
      case "book":
        return "fas fa-book book";
      default:
        return player ? "fas fa-hat-wizard " + player : "";
    }
  }

  return (
    <div
      onClick={() => console.log(player, row, column)}
      className={spaceClass()}>
      <i className={iconClass()}/>
    </div>
  );
}

export default Space;