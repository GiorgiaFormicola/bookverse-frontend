import { Modal, Button, Spinner } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { useState } from "react";

const DeleteConfirmModal = ({ show, onHide, onConfirm, username, bookId }) => {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Confirm deletion</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <Trash3Fill size={40} className="mb-3 text-danger" />
        {username && (
          <p className="mb-0 text-muted">
            Are you sure you want to delete user <strong>{username}</strong>? <br /> This operation is irreversible.
          </p>
        )}
        {bookId && (
          <p className="mb-0 text-muted">
            Are you sure you want to delete book <strong>{bookId}</strong>? <br /> This operation is irreversible.
          </p>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex gap-2">
        <Button disabled={loading} className="flex-grow-1 bv-btn-close" onClick={onHide}>
          Cancel
        </Button>
        <Button disabled={loading} className="flex-grow-1 bv-btn-delete" onClick={handleConfirm}>
          {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
