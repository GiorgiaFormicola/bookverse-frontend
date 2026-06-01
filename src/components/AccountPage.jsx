import { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Spinner, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeSlash, InfoCircleFill } from "react-bootstrap-icons";
import { Trash3Fill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { updateProfileInfo, updateProfileEmail, updateProfilePassword, deleteProfile } from "../redux/actions";

const AccountPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  const [username, setUsername] = useState(user?.username || "");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-z0-9_][a-z0-9_.]{1,29}$/;

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setUsernameSuccess(false);
    if (!usernameRegex.test(username)) {
      setUsernameError("Provide a valid username");
      return;
    }
    if (username === user?.username) {
      setUsernameError("This is already your username");
      return;
    }
    setUsernameLoading(true);
    try {
      await dispatch(updateProfileInfo({ username, displayName: user.displayName, bio: user.bio || "" }));
      setUsernameSuccess(true);
    } catch (err) {
      if (err.handled) return;
      setUsernameError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess(false);
    if (!emailRegex.test(email)) {
      setEmailError("Provide a valid email");
      return;
    }
    if (email === user?.email) {
      setEmailError("This is already your email");
      return;
    }
    setEmailLoading(true);
    try {
      await dispatch(updateProfileEmail({ email }));
      setEmailSuccess(true);
    } catch (err) {
      if (err.handled) return;
      setEmailError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!passwordRegex.test(newPassword)) {
      setPasswordError("Provide a valid password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      await dispatch(updateProfilePassword({ currentPassword, newPassword }));
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.handled) return;
      setPasswordError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="container-lg py-4 px-3 px-lg-4">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-1">Account settings</h1>
            <p className="text-muted mb-0">Manage your account information</p>
          </Col>
        </Row>

        <Row className="g-5">
          <Col lg={12}>
            <Row className="g-5">
              {/* Username */}
              <Col xs={12} md={6}>
                <div className="border border-secondary rounded-3 pe-lg-4 h-100">
                  <h5 className="fw-semibold mb-1">Username</h5>
                  <p className="text-muted small mb-4">Change your public username</p>
                  <Form noValidate onSubmit={handleUsernameSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2">
                        Username
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip>
                              <strong>Username</strong> must be 2–30 characters long and can contain lowercase letters, numbers, underscores and dots. It cannot
                              end with a dot or contain consecutive dots.
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
                        value={username}
                        onClick={() => {
                          setUsernameSuccess(false);
                          setUsernameError("");
                        }}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setUsernameError("");
                          setUsernameSuccess(false);
                        }}
                        size="lg"
                      />
                    </Form.Group>
                    <div
                      className={
                        "alert text-center bg-transparent border-0 p-0 mb-3" +
                        (usernameError || usernameSuccess ? "" : " invisible") +
                        (usernameError ? " alert-danger" : " alert-success")
                      }
                    >
                      {usernameError || (usernameSuccess ? "Username updated successfully!" : "placeholder")}
                    </div>
                    <Button type="submit" disabled={usernameLoading || !username || username === user?.username} className="w-100" size="lg">
                      {usernameLoading ? <Spinner animation="border" size="sm" /> : "Update username"}
                    </Button>
                  </Form>
                </div>
              </Col>
              {/* Email */}
              <Col xs={12} md={6}>
                <div className="border border-secondary rounded-3 ps-lg-4 h-100">
                  <h5 className="fw-semibold mb-1">Email address</h5>
                  <p className="text-muted small mb-4">Update the email associated with your account</p>
                  <Form noValidate onSubmit={handleEmailSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your new email"
                        value={email}
                        onClick={() => {
                          setEmailSuccess(false);
                          setEmailError("");
                        }}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                          setEmailSuccess(false);
                        }}
                        size="lg"
                      />
                    </Form.Group>
                    <div
                      className={
                        "alert text-center bg-transparent border-0 p-0 mb-3" +
                        (emailError || emailSuccess ? "" : " invisible") +
                        (emailError ? " alert-danger" : " alert-success")
                      }
                    >
                      {emailError || (emailSuccess ? "Email updated successfully!" : "placeholder")}
                    </div>
                    <Button type="submit" disabled={emailLoading || !email || email === user?.email} className="w-100" size="lg">
                      {emailLoading ? <Spinner animation="border" size="sm" /> : "Update email"}
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Col>

          {/* Password */}
          <Col lg={12}>
            <Row className="g-5">
              <Col xs={12} md={6}>
                <div className="border border-secondary rounded-3 pe-lg-4 me-xxl-3 h-100">
                  <h5 className="fw-semibold mb-1">Password</h5>
                  <p className="text-muted small mb-4">Change your account password</p>
                  <Form noValidate onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label>Current password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          value={currentPassword}
                          onClick={() => {
                            setPasswordError("");
                            setPasswordSuccess(false);
                          }}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            setPasswordError("");
                            setPasswordSuccess(false);
                          }}
                          size="lg"
                        />
                        <InputGroup.Text onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ cursor: "pointer" }}>
                          {showCurrentPassword ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="d-flex align-items-center gap-2">
                        New password
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip>
                              <strong>Password</strong> must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one
                              number and one special character.
                            </Tooltip>
                          }
                        >
                          <span style={{ display: "inline-flex", flexShrink: 0, cursor: "pointer" }}>
                            <InfoCircleFill />
                          </span>
                        </OverlayTrigger>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          value={newPassword}
                          onClick={() => {
                            setPasswordError("");
                            setPasswordSuccess(false);
                          }}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError("");
                            setPasswordSuccess(false);
                          }}
                          size="lg"
                        />
                        <InputGroup.Text onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: "pointer" }}>
                          {showNewPassword ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm new password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          value={confirmPassword}
                          onClick={() => {
                            setPasswordError("");
                            setPasswordSuccess(false);
                          }}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError("");
                            setPasswordSuccess(false);
                          }}
                          size="lg"
                        />
                        <InputGroup.Text onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                          {showConfirmPassword ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <div
                      className={
                        "alert text-center bg-transparent border-0 p-0 mb-3" +
                        (passwordError || passwordSuccess ? "" : " invisible") +
                        (passwordError ? " alert-danger" : " alert-success")
                      }
                    >
                      {passwordError || (passwordSuccess ? "Password updated successfully!" : "placeholder")}
                    </div>
                    <Button type="submit" disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword} className="w-100" size="lg">
                      {passwordLoading ? <Spinner animation="border" size="sm" /> : "Update password"}
                    </Button>
                  </Form>
                </div>
              </Col>
              {/* Delete account */}
              <Col xs={12} md={6}>
                <div className="border border-secondary rounded-3 ps-lg-4 me-xxl-3 h-100">
                  <h5 className="fw-semibold mb-1">Delete account</h5>
                  <p className="text-muted small mb-4 mb-md-5 pb-md-2">Delete your profile info, your library and your reviews</p>
                  <Button variant="danger" className="w-100" size="lg" onClick={() => setShowDeleteConfirm(true)}>
                    Delete my account
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Modal conferma eliminazione */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className="px-4">
          <Modal.Title className="text-danger">Delete account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 text-center py-4">
          <Trash3Fill size={48} className="text-danger mb-3" />
          <h5>Are you sure?</h5>
          <p className="text-muted mb-0">
            This action is <strong>irreversible</strong>. <br /> Your account, library and reviews will be permanently deleted.
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

export default AccountPage;
