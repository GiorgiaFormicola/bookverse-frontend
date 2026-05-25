import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, PlusCircleFill } from "react-bootstrap-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLEAR_ERROR, SET_ERROR, updateProfilePicture, updateProfileInfo } from "../../redux/actions";

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = new FormData();
  const user = useSelector((currentState) => currentState.profile.user);
  const error = useSelector((currentState) => currentState.error);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: user?.username, displayName: user?.displayName, bio: user?.bio });
  const deleteError = () => {
    if (error.isPresent) {
      dispatch({
        type: CLEAR_ERROR,
      });
    }
  };

  const validateForm = (form) => {
    if (form.username.trim() === "" || form.displayName.trim() === "") {
      dispatch({
        type: SET_ERROR,
        payload: {
          status: 400,
          message: "To continue you must provide all the required info",
          errorsList: [],
        },
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <Container>
        <Row>
          <Col xs={12}>
            <div className="d-flex align-items-center">
              <ChevronLeft size={20} onClick={() => navigate(-1)} />
              <h3 className="flex-grow-1 mb-0 text-center">Edit profile</h3>
            </div>
          </Col>
        </Row>
        <Row className=" justify-content-center g-3 py-3">
          <Col xs={12} className="d-flex justify-content-center">
            <div
              className="position-relative rounded-circle"
              style={{
                width: 200,
                height: 200,
              }}
            >
              <img src={user.profilePictureURL} alt={user.username} className="rounded-circle w-100 h-100 object-fit-cover" />
              <div
                className="position-absolute bottom-0 end-0 translate-middle-x translate-middle-y bg-primary rounded-circle d-flex align-items-center justify-content-center"
                onClick={() => handleShow()}
              >
                <PlusCircleFill size={30} />
              </div>
            </div>
          </Col>
          <Col xs={12}>
            <Form
              className=" fw-semibold small"
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                if (validateForm(form) === false) {
                  setLoading(false);
                  return;
                }
                dispatch(updateProfileInfo({ username: form.username, displayName: form.displayName, bio: form.bio || "" }));
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type your display name here"
                  value={form.displayName}
                  onClick={() => deleteError()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      displayName: value,
                    }));
                  }}
                />
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type your username here"
                  value={form.username}
                  onClick={() => deleteError()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      username: value,
                    }));
                  }}
                />
                <Form.Label>Biography</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type your biography here"
                  value={form.bio}
                  onClick={() => deleteError()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      bio: value,
                    }));
                  }}
                />
              </Form.Group>
              <Button className=" fw-semibold text-dark bg-accent border-0 rounded-pill w-100 py-2 fs-5" type="submit">
                Edit
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <div
            className="small text-center d-flex flex-column flex-grow-1 justify-content-center"
            style={{
              visibility: error.isPresent ? "visible" : "hidden",
            }}
          >
            {error.errorsList?.length > 0 &&
              error.errorsList.map((error, i) => {
                return (
                  <p key={`error-${i}`} className="my-0">
                    {error}
                  </p>
                );
              })}
            {error.errorsList?.length == 0 && <p className="my-0">{error.message}</p>}
            {!error.message && (
              <>
                <p className="my-0">placeholder</p>
                <p className="my-0">placeholder</p>
                <p className="my-0">placeholder</p>
                <p className="my-0">placeholder</p>
              </>
            )}
          </div>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="d-flex align-items-center px-4">
          <Modal.Title className="fs-5">Upload profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5 mx-3  my-3 text-center">
          <img
            src={user.profilePictureURL}
            alt={user.username}
            className=" img-fluid rounded-circle my-4 "
            style={{
              width: 200,
              height: 200,
              objectFit: "cover",
            }}
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-end px-4">
          <div className="d-flex">
            <Form>
              <Form.Group>
                <Form.Label
                  htmlFor="file-upload"
                  style={{ marginBottom: "0", cursor: "pointer" }}
                  className="btn bg-primary text-light rounded-pill px-3 fw-semibold py-1 text-nowrap"
                >
                  Upload picture
                </Form.Label>
                <Form.Control
                  className="d-none"
                  type="file"
                  accept="image/*,.pdf"
                  id="file-upload"
                  onChange={(e) => {
                    data.append("profile_picture", e.target.files[0]);
                    dispatch(updateProfilePicture(data));
                  }}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateProfilePage;
