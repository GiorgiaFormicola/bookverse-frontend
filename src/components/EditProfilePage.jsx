import { Container, Row, Col, Form, Button, Modal, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, PlusCircleFill, InfoCircleFill, ArrowClockwise } from "react-bootstrap-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture, updateProfileInfo } from "../redux/actions";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((currentState) => currentState.profile.user);

  const [form, setForm] = useState({ username: user?.username, displayName: user?.displayName, bio: user?.bio });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [error, setError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const originalUser = { username: user?.username, displayName: user?.displayName, bio: user?.bio };

  const validateForm = (form) => {
    if (form.displayName === null || form.displayName.trim() === "" || form.displayName.length < 2 || form.displayName.length > 50) {
      setError("Provide a valid displayname");
      return false;
    }
    if (form.bio && form.bio.length > 500) {
      setError("Bio must be maximum 500 characters");
      return false;
    }
    return true;
  };

  const hasChanged = () => {
    if (originalUser.displayName === form.displayName && originalUser.bio === form.bio) {
      return false;
    } else {
      return true;
    }
  };

  const editProfileInfo = async () => {
    setLoading(true);
    if (!validateForm(form)) {
      setLoading(false);
      return;
    }
    try {
      await dispatch(updateProfileInfo({ username: user.username, displayName: form.displayName, bio: form.bio || "" }));
      navigate("/me");
    } catch (err) {
      if (err.handled) return;
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong with your request");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="d-flex flex-column container-lg p-4 gap-3">
        <Row className="justify-content-center">
          <Col xs={12} className="position-relative d-flex align-items-center justify-content-center">
            <span
              className="position-absolute start-0 d-flex align-items-center gap-1 view-more-link fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={15} />
              <span>Back</span>
            </span>
            <h1 className="mb-0">Edit profile</h1>
          </Col>
        </Row>

        {/* Profile picture */}
        <Row className="justify-content-center g-3 py-3">
          <Col xs={7} sm={5} md={4} lg={3} className="d-flex justify-content-center">
            <div className="position-relative d-inline-block">
              <img src={user.profilePictureURL} alt={user.username} className="avatar" />
              <div
                className="position-absolute bottom-0 end-0 translate-middle-x translate-middle-y"
                style={{ cursor: "pointer", border: "2px solid var(--bg-deep)", borderRadius: "50%", lineHeight: 0 }}
                onClick={handleShow}
              >
                <PlusCircleFill size={32} className="text-accent" />
              </div>
            </div>
          </Col>
        </Row>

        {/* Form */}
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                editProfileInfo();
              }}
            >
              <Form.Group className="mb-4" controlId="profileName">
                <Form.Label className="d-flex align-items-center gap-2 fw-semibold">
                  Profile Name
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip className="custom-tooltip">
                        <strong>Profile name</strong> must be 2–50 characters long and will be shown on your profile and reviews.
                      </Tooltip>
                    }
                    popperConfig={{
                      modifiers: [
                        { name: "computeStyles", options: { gpuAcceleration: false } },
                        { name: "preventOverflow", options: { boundary: "clippingParents" } },
                      ],
                    }}
                  >
                    <span style={{ display: "inline-flex", flexShrink: 0, cursor: "pointer" }}>
                      <InfoCircleFill />
                    </span>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={50}
                  placeholder="Choose your profile name"
                  value={form.displayName}
                  onClick={() => setError("")}
                  onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="biography">
                <Form.Label className="fw-semibold">Biography</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  maxLength={500}
                  placeholder="Let other readers know something about you!"
                  value={form.bio}
                  onClick={() => setError("")}
                  onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                />
                <p className="fw-normal small text-faint text-end mb-0 mt-2">{form.bio?.length || 0}/500</p>
              </Form.Group>

              <div className={"alert alert-danger bg-transparent text-center border-0 p-0 mb-3" + (error ? "" : " invisible")} role="alert">
                {error || "Error placeholder"}
              </div>

              <Button disabled={!hasChanged() || loading} className="w-100 fw-semibold bv-btn-confirm py-2 fs-5" type="submit">
                {loading ? <Spinner animation="border" size="sm" /> : "Save"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Modal upload profile picture */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="px-4">
          <Modal.Title className="fs-5">Upload profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 300 }}>
          {uploadLoading ? (
            <Spinner animation="border" style={{ color: "var(--primary-light)" }} />
          ) : uploadError ? (
            <div className="bv-empty-state py-3">
              <ArrowClockwise size={30} className="bv-empty-state__icon" style={{ cursor: "pointer" }} onClick={() => setUploadError(false)} />
              <p className="bv-empty-state__text mb-0">Something went wrong uploading the picture.</p>
              <span className="bv-empty-state__link" style={{ cursor: "pointer" }} onClick={() => setUploadError(false)}>
                Try again
              </span>
            </div>
          ) : (
            <img src={user.profilePictureURL} alt={user.username} className="avatar" style={{ width: 160 }} />
          )}
        </Modal.Body>
        <Modal.Footer className="px-4">
          <Form>
            <Form.Group>
              <Form.Label htmlFor="file-upload" className="bv-btn-confirm btn mb-0 fw-semibold" style={{ cursor: "pointer" }}>
                Upload picture
              </Form.Label>
              <Form.Control
                className="d-none"
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={async (e) => {
                  const data = new FormData();
                  data.append("profile_picture", e.target.files[0]);
                  setUploadLoading(true);
                  setUploadError(false);
                  try {
                    await dispatch(updateProfilePicture(data));
                    handleClose();
                  } catch (err) {
                    if (err.handled) return;
                    setUploadError(true);
                  } finally {
                    setUploadLoading(false);
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditProfilePage;
