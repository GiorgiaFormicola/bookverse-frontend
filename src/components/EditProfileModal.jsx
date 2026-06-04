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
    if (!form.displayName || form.displayName.trim() === "" || form.displayName.length < 2 || form.displayName.length > 50) {
      setError("Provide a valid display name");
      return false;
    }
    if (form.bio && form.bio.length > 500) {
      setError("Bio must be maximum 500 characters");
      return false;
    }
    return true;
  };

  const hasChanged = () => originalUser.displayName !== form.displayName || originalUser.bio !== form.bio;

  const editProfileInfo = async () => {
    setLoading(true);
    if (!validateForm(form)) {
      setLoading(false);
      return;
    }
    try {
      await dispatch(updateProfileInfo({ username: user.username, displayName: form.displayName, bio: form.bio || "" }));
      handleClose();
    } catch (err) {
      if (err.handled) return;
      setError(err.response?.data?.message || "Something went wrong with your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="px-4">
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          {/* Profile picture */}
          <div className="d-flex justify-content-center my-3">
            <div className="position-relative d-inline-block">
              {uploadLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 200, width: 200 }}>
                  <Spinner animation="border" style={{ color: "var(--text-muted)" }} />
                </div>
              ) : uploadError ? (
                <div className="d-flex flex-column align-items-center gap-2 py-3" style={{ width: 200 }}>
                  <p className="mb-0 small text-danger">Something went wrong uploading the picture.</p>
                  <ArrowClockwise size={24} className="cursor-pointer text-muted" onClick={() => setUploadError(false)} />
                </div>
              ) : (
                <>
                  <img src={user.profilePictureURL} alt={user.username} className="avatar" style={{ width: 200 }} />
                  <Form.Label
                    htmlFor="modal-file-upload"
                    className="position-absolute bottom-0 end-0 bg-dark rounded-circle d-flex align-items-center justify-content-center mb-0 cursor-pointer"
                    style={{ width: 30, height: 30 }}
                  >
                    <PlusCircleFill size={30} className="text-accent" />
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
                        } catch (err) {
                          if (err.handled) return;
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
                    <Tooltip className="custom-tooltip">
                      <strong>Profile name</strong> must be 2–50 characters long.
                    </Tooltip>
                  }
                >
                  <span className="d-inline-flex flex-shrink-0 cursor-pointer">
                    <InfoCircleFill />
                  </span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                type="text"
                maxLength={50}
                placeholder="Choose your profile name"
                value={form.displayName}
                onFocus={() => setError(false)}
                onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="modalBio">
              <Form.Label className="fw-semibold fs-5">Biography</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                maxLength={500}
                placeholder="Let other readers know something about you!"
                value={form.bio}
                onFocus={() => setError(false)}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              />
              <p className="fw-normal small text-faint text-end mb-0 mt-2">{form.bio?.length || 0}/500</p>
            </Form.Group>
            <div className={"alert alert-danger text-center bg-transparent border-0 p-0 mb-2" + (error ? "" : " invisible")} role="alert">
              {error || "Error placeholder"}
            </div>

            <Button disabled={!hasChanged() || loading} className="w-100 fw-semibold my-2 fs-4 bv-btn-confirm" type="submit">
              {loading ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfileModal;
