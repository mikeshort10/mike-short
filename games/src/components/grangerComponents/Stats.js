import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';

function Stats (props) {
	let level = props.playerLevel;
	let HP = props.playerHP;
	let maxHP = props.playerMaxHP;
	let abilities = props.abilities;
	let colSize = "col-xs-3 ";
	let hasLumos = colSize + (abilities.lumosPlus ? "far fa-lightbulb" : "hide-icon");
	let hasCloak = colSize + (abilities.hasCloak ? "fas fa-mask" : "hide-icon");
	let alohomora = colSize + (abilities.alohomora ? "fas fa-book" : "hide-icon");

	return (
		<Card id="stats-panel">
			<Card.Body id="stats">
				{"Level " + level }
				<br />
				<ProgressBar className="black-font">
					XP <ProgressBar now={props.playerXP} max={level * 10} key={1} />
				</ProgressBar>
				<ProgressBar className="black-font">
					HP <ProgressBar variant="success" now={HP} max={maxHP} key={2} />
				</ProgressBar>
				<div className="row">
					<i className={ hasLumos } />
					<i className={ hasCloak } />
					<i className={ alohomora } />
				</div>
			</Card.Body>
		</Card>
	);
}

export default Stats;