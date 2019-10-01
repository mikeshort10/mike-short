import React from "react";
import { Card, FormGroup, FormCheck, Button } from "react-bootstrap";

export function Settings(props) {
	return (
		<div>
			<Card
				style={{ color: "white", backgroundColor: "black" }}
				className="start-panel border-none"
			>
				<Card.Header
					style={{ color: "black", backgroundColor: "white" }}
					className="text-center header"
				>
					Select Your Difficulty
				</Card.Header>
				<Card.Header
					style={{ color: "black", backgroundColor: "white" }}
					className="header-placeholder"
				>
					S
				</Card.Header>
				<Card.Body>
					How many students were cursed?
					<FormGroup>
						<FormCheck
							type="radio"
							name="numOfEnemies"
							onChange={() =>
								props.changeState("numOfEnemies", 6)
							}
							value={6}
							label="6"
						/>
						<FormCheck
							type="radio"
							name="numOfEnemies"
							onChange={() =>
								props.changeState("numOfEnemies", 12)
							}
							value={12}
							checked={props.numOfEnemies === 12}
							label="12"
						/>
						<FormCheck
							type="radio"
							name="numOfEnemies"
							onChange={() =>
								props.changeState("numOfEnemies", 18)
							}
							value={18}
							label="18"
						/>
					</FormGroup>
					Which house were they from?
					<FormGroup>
						<FormCheck
							type="radio"
							name="enemyType"
							onChange={() =>
								props.changeState("enemyType", "hufflepuff")
							}
							value="hufflepuff"
							checked={props.enemyType === "hufflepuff"}
							label="Hufflepuff"
						/>
						<FormCheck
							type="radio"
							name="enemyType"
							onChange={() =>
								props.changeState("enemyType", "ravenclaw")
							}
							value="ravenclaw"
							label="Ravenclaw"
						/>
						<FormCheck
							type="radio"
							name="enemyType"
							onChange={() =>
								props.changeState("enemyType", "slytherin")
							}
							value="slytherin"
							label="Slytherin"
						/>
					</FormGroup>
				</Card.Body>
				<Button
					className="start-button"
					onClick={() => props.changeStatus("play")}
					variant="success"
					block
				>
					Play
				</Button>
			</Card>
		</div>
	);
}
