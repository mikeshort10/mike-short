import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Stats from './Stats';
import Board from './Board';

function Play (props) {
	return (
        <div>
          <div className={props.modal ? "static-modal" : "static-modal modal-hide"}>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>{props.modalText[props.modal].title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{props.modalText[props.modal].body}</Modal.Body>
              <Modal.Footer>
                <Button 
                variant="primary" 
                onClick={() => props.setState({ modal : 0 })}>
                	Got It!
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
          <div>
            <Stats
              abilities={props.abilities}
              playerLevel={props.playerLevel}
              playerXP={props.playerXP}
              playerHP={props.playerHP}
              playerAttack={props.playerAttack}
              playerMaxHP={props.playerMaxHP}
            />
          </div>
          <Board board={props.board} abilities={props.abilities} />
        </div>
      );
}

export default Play;