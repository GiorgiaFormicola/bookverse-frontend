import { Modal, Button } from "react-bootstrap";

const DeleteConfirmModal = ({ show, onHide, onConfirm, username, bookId }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm deleting</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {username && (
          <>
            Are you sure you want to delete user <strong>{username}</strong>? <br /> This operation is irreversible.
          </>
        )}
        {bookId && (
          <>
            Are you sure you want to delete book <strong>{bookId}</strong>? <br /> This operation is irreversible.
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Undo
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
