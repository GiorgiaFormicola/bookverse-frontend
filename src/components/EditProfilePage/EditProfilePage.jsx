import { Container, Row, Col, Form, Button, Modal, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, PlusCircleFill, InfoCircleFill, ArrowClockwise, Trash3Fill } from "react-bootstrap-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture, updateProfileInfo, deleteProfile } from "../../redux/actions";

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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const originalUser = { username: user?.username, displayName: user?.displayName, bio: user?.bio };

  const validateForm = (form) => {
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-z0-9_][a-z0-9_.]{1,29}$/;
    if (form.username === null || form.username.trim() === "" || !usernameRegex.test(form.username)) {
      setError("Provide a valid username");
      return false;
    }

    if (form.displayName === null || form.displayName.trim() === "" || form.displayName.length < 2 || form.displayName.length > 50) {
      setError("Provide a valid displayname");
      return false;
    }
    return true;
  };

  const hasChanged = () => {
    if (originalUser.username === form.username && originalUser.displayName === form.displayName && originalUser.bio === form.bio) {
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
      await dispatch(updateProfileInfo({ username: form.username, displayName: form.displayName, bio: form.bio || "" }));
      navigate("/me");
    } catch (err) {
      console.log(err);
      if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
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
      <Container fluid className="d-flex flex-column p-4 px-5 gap-3">
        <Row className="justify-content-center">
          <Col xs={12} className="position-relative">
            <ChevronLeft className="position-absolute" size={30} onClick={() => navigate(-1)} />
            <h1 className="text-center">Edit profile</h1>
          </Col>
        </Row>
        <Row className=" justify-content-center g-3 py-3">
          <Col xs={7} className="d-flex justify-content-center">
            <div className="position-relative rounded-circle">
              <img src={user.profilePictureURL} alt={user.username} className="avatar" />
              <div
                className="position-absolute bottom-0 end-0 translate-middle-x translate-middle-y bg-dark rounded-circle d-flex align-items-center justify-content-center me-sm-3"
                onClick={() => handleShow()}
              >
                <PlusCircleFill className="me-3 d-sm-none" size={30} />
                <PlusCircleFill className="me-3 d-none d-sm-block d-md-none" size={40} />
                <PlusCircleFill className="me-4 d-none d-md-block" size={50} />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Form
              noValidate
              className=" fw-semibold small"
              onSubmit={(e) => {
                e.preventDefault();
                editProfileInfo();
              }}
            >
              <Form.Group className="mb-4" controlId="profileName">
                <Form.Label className="d-flex align-items-center gap-2 fs-4">
                  Profile Name
                  <OverlayTrigger
                    key="profileName"
                    placement="right"
                    overlay={
                      <Tooltip id="username-tooltip">
                        <strong>Profile name</strong> must be 2–50 characters long and it will be the name that we'll be shown on your profile and on your
                        reviews.
                      </Tooltip>
                    }
                    popperConfig={{
                      modifiers: [
                        {
                          name: "computeStyles",
                          options: {
                            gpuAcceleration: false,
                          },
                        },
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "clippingParents",
                          },
                        },
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
                  placeholder="Choose your profile name"
                  value={form.displayName}
                  onClick={() => setError("")}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }));
                  }}
                  required
                  size="lg"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="username">
                <Form.Label className="d-flex align-items-center gap-2 fs-4">
                  Username
                  <OverlayTrigger
                    key="username"
                    placement="right"
                    overlay={
                      <Tooltip id="username-tooltip">
                        <strong>Username</strong> must be 2–30 characters long and can contain lowercase letters, numbers, underscores and dots. It cannot end
                        with a dot or contain consecutive dots.
                      </Tooltip>
                    }
                    popperConfig={{
                      modifiers: [
                        {
                          name: "computeStyles",
                          options: {
                            gpuAcceleration: false,
                          },
                        },
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "clippingParents",
                          },
                        },
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
                  placeholder="Choose a username"
                  value={form.username}
                  onClick={() => setError("")}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }));
                  }}
                  required
                  size="lg"
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="biography">
                <Form.Label className="fs-4">Biography</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  placeholder="Let other readers know something about you!"
                  value={form.bio}
                  onClick={() => setError("")}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }));
                  }}
                  size="lg"
                />
              </Form.Group>
              <div className={"alert alert-danger text-center bg-transparent border-0 p-0" + (error ? "" : " invisible")} role="alert">
                {error ? error : "Error placeholder"}
              </div>
              <Button disabled={!hasChanged() || loading} className=" fw-semibold bg-primary border-0 w-100 py-2 fs-4 mt-1" type="submit">
                {loading ? "Updating profile..." : "Save"}
              </Button>
            </Form>
            <Button
              variant="outline-danger"
              disabled={deleteLoading}
              className="w-100 fw-semibold mt-3 mb-3 fs-4"
              type="botton"
              onClick={() => {
                setShowDeleteConfirm(true);
              }}
            >
              {loading ? "Deleting account..." : "Delete account"}
            </Button>
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="d-flex align-items-center px-4">
          <Modal.Title className="fs-5">Upload profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5 mx-3 my-3 text-center d-flex flex-column justify-content-center" style={{ minHeight: 420 }}>
          {uploadLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
              <Spinner animation="border" />
            </div>
          ) : uploadError ? (
            <div className="d-flex flex-column align-items-center gap-3 py-3">
              <p className="text-danger mb-0">Something went wrong uploading the picture.</p>
              <ArrowClockwise size={30} style={{ cursor: "pointer" }} onClick={() => setUploadError(false)} />
            </div>
          ) : (
            <img src={user.profilePictureURL} alt={user.username} className="avatar" />
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-end px-4">
          <div className="d-flex">
            <Form>
              <Form.Group>
                <Form.Label
                  htmlFor="file-upload"
                  style={{ marginBottom: "0", cursor: "pointer" }}
                  className="btn bg-primary text-light px-3 fw-semibold py-1 text-nowrap"
                >
                  Upload picture
                </Form.Label>
                <Form.Control
                  className="d-none"
                  type="file"
                  accept="image/*,.pdf"
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
                      console.log(err);
                      if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
                      setUploadError(true);
                    } finally {
                      setUploadLoading(false);
                    }
                  }}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className="px-4">
          <Modal.Title className="text-danger">Delete account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 text-center py-4">
          <Trash3Fill size={48} className="text-danger mb-3" />
          <h5>Are you sure?</h5>
          <p className="text-muted mb-0">
            This action is <strong>irreversible</strong>. Your account, library and reviews will be permanently deleted.
          </p>
        </Modal.Body>
        <Modal.Footer className="px-4 d-flex gap-2">
          <Button variant="secondary" className="flex-grow-1" onClick={() => setShowDeleteConfirm(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-grow-1"
            onClick={() => {
              setDeleteLoading(true);
              dispatch(deleteProfile());
            }}
            disabled={deleteLoading}
          >
            {deleteLoading ? <Spinner animation="border" size="sm" /> : "Yes, delete my account"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditProfilePage;
