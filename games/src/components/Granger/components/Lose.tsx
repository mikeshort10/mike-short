import React from "react";
import { Card, Button } from "react-bootstrap";
import { partial } from "lodash";
import { IGrangerState } from "..";

interface IProps {
	status: IGrangerState["status"];
	changeStatus(key: IGrangerState["status"]): void;
}

export function Lose(props: IProps) {
	return (
		<div className="message text-center">
			<Card id="controls border-none">
				<Card.Header>{`You ${props.status}!`}</Card.Header>
				<Card.Body>
					<Button
						variant="primary"
						onClick={partial(props.changeStatus, "select")}
					>
						Replay
					</Button>
				</Card.Body>
			</Card>
		</div>
	);
}
