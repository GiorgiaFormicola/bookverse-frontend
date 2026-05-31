import { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { instance } from "../config/api";
import { Book, Eye, EyeSlash, InfoCircleFill } from "react-bootstrap-icons";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = () => {
    const password = newPassword;

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (password === null || password.trim() === "" || !passwordRegex.test(password)) {
      setError("Provide a valid password");
      return false;
    }

    if (password !== confirmPassword) {
      setError("To continue passwords must match");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!validatePassword()) {
      setLoading(false);
      return;
    }
    instance
      .post("/auth/reset-password", { tokenId: token, newPassword })
      .then(() => navigate("/login", { state: { passwordReset: true } }))
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        setError(err.response?.data?.message || "Something went wrong. Try again.");
      })
      .finally(() => setLoading(false));
  };

  if (!token) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center d-flex flex-column align-items-center gap-3">
          <p className="mb-0">Invalid reset link.</p>
          <Link to="/forgot-password" className="text-decoration-none text-light fw-semibold">
            Request a new one
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="border-0 shadow-lg p-4">
            <div className="text-center mb-4">
              <Book size={48} className="text-primary mb-2" />
              <h3>Reset password</h3>
              <p className="text-muted small mb-0">Enter your new password</p>
            </div>
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="newPassword">
                <Form.Label className="d-flex align-items-center gap-2">
                  New password
                  <OverlayTrigger
                    key="newPassword"
                    placement="right"
                    overlay={
                      <Tooltip id="newPassword-tooltip" className="custom-tooltip">
                        <strong>Password</strong> must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number
                        and one special character.
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
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    size="lg"
                  />
                  <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onClick={() => setError("")}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    required
                    size="lg"
                  />
                  <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <div className={"alert alert-danger text-center bg-transparent border-0 p-0 mb-3" + (error ? "" : " invisible")}>{error || "placeholder"}</div>
              <Button type="submit" disabled={loading || !newPassword} className="w-100 auth-gradient border-0" size="lg">
                {loading ? <Spinner animation="border" size="sm" /> : "Reset password"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordPage;
