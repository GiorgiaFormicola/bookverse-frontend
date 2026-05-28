import { Modal, Form, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleFill, InfoCircleFill, ArrowClockwise } from "react-bootstrap-icons";
import { updateProfileInfo, updateProfilePicture } from "../redux/actions";

const EditProfileModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  const [form, setForm] = useState({ username: user?.username, displayName: user?.displayName, bio: user?.bio });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const originalUser = { username: user?.username, displayName: user?.displayName, bio: user?.bio };

  const validateForm = (form) => {
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-z0-9_][a-z0-9_.]{1,29}$/;
    if (!form.username || form.username.trim() === "" || !usernameRegex.test(form.username)) {
      setError("Provide a valid username");
      return false;
    }
    if (!form.displayName || form.displayName.trim() === "" || form.displayName.length < 2 || form.displayName.length > 50) {
      setError("Provide a valid display name");
      return false;
    }
    return true;
  };

  const hasChanged = () => originalUser.username !== form.username || originalUser.displayName !== form.displayName || originalUser.bio !== form.bio;

  const editProfileInfo = async () => {
    setLoading(true);
    if (!validateForm(form)) {
      setLoading(false);
      return;
    }
    try {
      await dispatch(updateProfileInfo({ username: form.username, displayName: form.displayName, bio: form.bio || "" }));
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong with your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="px-4">
        <Modal.Title>Edit profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        {/* Sezione immagine profilo */}
        <div className="d-flex justify-content-center my-3">
          <div className="position-relative d-inline-block">
            {uploadLoading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: 200, width: 200 }}>
                <Spinner animation="border" />
              </div>
            ) : uploadError ? (
              <div className="d-flex flex-column align-items-center gap-3 py-3" style={{ width: 200 }}>
                <p className="text-danger mb-0 text-center">Something went wrong uploading the picture.</p>
                <ArrowClockwise size={30} style={{ cursor: "pointer" }} onClick={() => setUploadError(false)} />
              </div>
            ) : (
              <>
                <img src={user.profilePictureURL} alt={user.username} className="avatar" style={{ width: 200 }} />
                <Form.Label
                  htmlFor="modal-file-upload"
                  className="position-absolute bottom-0 end-0 bg-dark rounded-circle d-flex align-items-center justify-content-center mb-0"
                  style={{ cursor: "pointer", width: 30, height: 30 }}
                >
                  <PlusCircleFill size={30} />
                  <Form.Control
                    className="d-none"
                    type="file"
                    accept="image/*"
                    id="modal-file-upload"
                    onChange={async (e) => {
                      const data = new FormData();
                      data.append("profile_picture", e.target.files[0]);
                      setUploadLoading(true);
                      setUploadError(false);
                      try {
                        await dispatch(updateProfilePicture(data));
                      } catch {
                        setUploadError(true);
                      } finally {
                        setUploadLoading(false);
                      }
                    }}
                  />
                </Form.Label>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <Form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            editProfileInfo();
          }}
        >
          <Form.Group className="mb-3" controlId="modalDisplayName">
            <Form.Label className="fw-semibold d-flex align-items-center gap-2 fs-5">
              Profile Name
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip>
                    <strong>Profile name</strong> must be 2–50 characters long.
                  </Tooltip>
                }
              >
                <span style={{ display: "inline-flex", flexShrink: 0, cursor: "pointer" }}>
                  <InfoCircleFill />
                </span>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose your profile name"
              value={form.displayName}
              onFocus={() => setError(false)}
              onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="modalUsername">
            <Form.Label className="fw-semibold d-flex align-items-center gap-2 fs-5">
              Username
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip>
                    <strong>Username</strong> must be 2–30 characters long.
                  </Tooltip>
                }
              >
                <span style={{ display: "inline-flex", flexShrink: 0, cursor: "pointer" }}>
                  <InfoCircleFill />
                </span>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onFocus={() => setError(false)}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="modalBio">
            <Form.Label className="fw-semibold fs-5">Biography</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Let other readers know something about you!"
              value={form.bio}
              onFocus={() => setError(false)}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </Form.Group>

          <Button disabled={!hasChanged() || loading} className="w-100 fw-semibold mt-4 mb-3 fs-4" type="submit">
            {loading ? "Updating profile..." : "Save"}
          </Button>
          <div className={"alert alert-danger text-center bg-transparent border-0 p-0 mb-2" + (error ? "" : " invisible")} role="alert">
            {error || "Error placeholder"}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
