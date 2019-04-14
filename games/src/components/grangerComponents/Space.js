import React from 'react';

export default function Space (props) {
  const space = props.space;
  const player = space.player;
  const spaceClass = (() => {
    if (props.space.darkness) return "darkness";
    else if (!props.pace.playable && (props.space.player === undefined || props.space.player === "door")) return "wall";
    else return "space";
  })();
  const iconClass = (() => {
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
        return props.space.player ? "fas fa-hat-wizard " + props.space.player : "";
    }
  })();

  return (
    <div className={spaceClass}>
      <i className={iconClass}/>
    </div>
  );
}