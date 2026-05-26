import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { instance } from "../../config/api";
const EditUserModal = ({ show, onHide, user, handleSaveUser }) => {
  const [userRole, setUserRole] = useState(user?.role);
  const [userIsActive, setUserIsActive] = useState(user?.active ? "true" : "false");

  if (!user) return null;

  const originalUser = { role: user?.role, isActive: user?.active };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === "ADMIN") {
      setUserIsActive("true");
    }
  };

  const handleSave = async () => {
    if (!user) return;

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
      console.log(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <strong>{user.username}</strong>
          <div className="text-muted small">{user.email}</div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select value={userRole} onChange={(e) => handleRoleChange(e.target.value)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select disabled={userRole === "ADMIN"} value={userIsActive} onChange={(e) => setUserIsActive(e.target.value === "true")}>
            <option value="true">ACTIVE</option>
            <option value="false">SUSPENDED</option>
          </Form.Select>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={() => handleSave()}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
