import { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { instance } from "../config/api";

const EditUserModal = ({ show, onHide, user, handleSaveUser }) => {
  const [userRole, setUserRole] = useState(user?.role);
  const [userIsActive, setUserIsActive] = useState(user?.active ? "true" : "false");
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const originalUser = { role: user?.role, isActive: user?.active };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === "ADMIN") {
      setUserIsActive("true");
    }
  };

  const handleClose = () => {
    if (loading) return;
    onHide();
  };

  const handleSave = async () => {
    if (!user) return;
    setSaveError("");
    setLoading(true);
    try {
      if (userRole !== "ADMIN") {
        if (userRole !== originalUser.role) {
          await instance.patch(`/users/${user.id}/role`, {
            role: userRole,
          });
        }

        if ((userIsActive === "true") !== originalUser.isActive) {
          await instance.patch(`/users/${user.id}/status`, {
            isActive: userIsActive === "true",
          });
        }
      }

      if (userRole === "ADMIN") {
        if ((userIsActive === "true") !== originalUser.isActive) {
          await instance.patch(`/users/${user.id}/status`, {
            isActive: userIsActive === "true",
          });
        }
        if (userRole !== originalUser.role) {
          await instance.patch(`/users/${user.id}/role`, {
            role: userRole,
          });
        }
      }

      handleSaveUser();
    } catch (err) {
      if (err.handled) return;
      setSaveError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-4">
          <strong>{user.username}</strong>
          <div className="small text-muted">{user.email}</div>
        </div>

        {/* Role */}
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select value={userRole} onChange={(e) => handleRoleChange(e.target.value)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </Form.Select>
        </Form.Group>

        {/* Status */}
        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select disabled={userRole === "ADMIN"} value={userIsActive} onChange={(e) => setUserIsActive(e.target.value === "true")}>
            <option value="true">ACTIVE</option>
            <option value="false">SUSPENDED</option>
          </Form.Select>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="flex-column gap-2">
        <div className={"alert bg-transparent border-0 p-0 w-100 text-center" + (saveError ? " alert-danger" : " invisible")}>{saveError || "placeholder"}</div>
        <div className="d-flex gap-2 w-100">
          <Button disabled={loading} className="flex-grow-1 bv-btn-close" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={loading} className="flex-grow-1 bv-btn-confirm" onClick={() => handleSave()}>
            {loading ? <Spinner animation="border" size="sm" style={{ color: "var(--bg-deep)" }} /> : "Save Changes"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
