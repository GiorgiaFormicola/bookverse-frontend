import { Modal, Button } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";

const DeleteConfirmModal = ({ show, onHide, onConfirm, username, bookId }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Confirm deletion</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <Trash3Fill size={40} className="mb-3 text-danger" />
        {username && (
          <p className="mb-0 text-muted">
            Are you sure you want to delete user <strong style={{ color: "var(--text-primary)" }}>{username}</strong>? <br /> This operation is irreversible.
          </p>
        )}
        {bookId && (
          <p className="mb-0 text-muted">
            Are you sure you want to delete book <strong style={{ color: "var(--text-primary)" }}>{bookId}</strong>? <br /> This operation is irreversible.
          </p>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex gap-2">
        <Button className="flex-grow-1 bv-btn-close" onClick={onHide}>
          Cancel
        </Button>
        <Button className="flex-grow-1 bv-btn-delete" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
