import React from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { Player } from "../classes/Player";

interface IProps {
	player: Player;
}

export function Stats(props: IProps) {
	const {
		level,
		HP,
		maxHP,
		XP,
		lumosPlus,
		hasCloak,
		alohomora,
	} = props.player;
	const colSize = "col-xs-3 ";
	const hasLumos = lumosPlus ? "far fa-lightbulb" : "hide-icon";
	const cloaked = hasCloak ? "fas fa-mask" : "hide-icon";
	const unlock = alohomora ? "fas fa-book" : "hide-icon";

	return (
		<Card id="stats-panel">
			<Card.Body id="stats">
				{`Level ${level}`}
				<br />
				<ProgressBar key={1} className="black-font">
					XP <ProgressBar now={XP} max={level * 10} />
				</ProgressBar>
				<ProgressBar key={2} className="black-font">
					HP <ProgressBar variant="success" now={HP} max={maxHP} />
				</ProgressBar>
				<div className="row">
					<i className={`${colSize} ${hasLumos}`} />
					<i className={`${colSize} ${cloaked}`} />
					<i className={`${colSize} ${unlock}`} />
				</div>
			</Card.Body>
		</Card>
	);
}
