import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Stats } from "./Stats";
import Board from "./Board";
import { partial } from "lodash";

export function Play(props) {
	const { modal, abilities, modalText, player, setState, board } = props;
	const { title, body } = modalText[modal];
	return (
		<div>
			<div className={`static-modal ${modal ? "" : "modal-hide"}`}>
				<Modal.Dialog>
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{body}</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={partial(setState, { modal: 0 })}
						>
							Got It!
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</div>
			<div>
				<Stats abilities={abilities} player={player} />
			</div>
			<Board board={board} abilities={abilities} />
		</div>
	);
}
