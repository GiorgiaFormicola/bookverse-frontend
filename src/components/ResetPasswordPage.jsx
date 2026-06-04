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
        if (err.handled) return;
        setError(err.response?.data?.message || "Something went wrong. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {!token ? (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient">
          <div className="bv-empty-state">
            <h5 className="bv-empty-state__title">Invalid reset link</h5>
            <p className="bv-empty-state__text">This link is invalid or has expired.</p>
            <Link to="/forgot-password" className="bv-empty-state__link">
              Request a new one
            </Link>
          </div>
        </Container>
      ) : (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient">
          <Row className="justify-content-center w-100">
            <Col xs={12} md={11} lg={9} xl={7}>
              <Card className="bv-auth-card border-0 px-4 px-lg-5 py-5">
                <div className="text-center mb-4">
                  <div className="bv-brand d-flex align-items-center justify-content-center gap-2 mb-3">
                    <span className="bv-brand__icon">
                      <Book size={30} className="text-accent" />
                    </span>
                    <span className="bv-brand__text">
                      Book<span className="bv-brand__accent">Verse</span>
                    </span>
                  </div>
                  <h3>Reset password</h3>
                  <p className="small mb-0 text-muted">Enter your new password</p>
                </div>

                {/* Form */}
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label className="d-flex align-items-center gap-2">
                      New password
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Tooltip className="custom-tooltip">
                            <strong>Password</strong> must be at least 8 characters and include uppercase, lowercase and a number.
                          </Tooltip>
                        }
                        popperConfig={{
                          modifiers: [
                            { name: "computeStyles", options: { gpuAcceleration: false } },
                            { name: "preventOverflow", options: { boundary: "clippingParents" } },
                          ],
                        }}
                      >
                        <span className="d-inline-flex flex-shrink-0 cursor-pointer">
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
                      <InputGroup.Text className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
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
                      <InputGroup.Text className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <div className={"alert bg-transparent text-center border-0 p-0 mb-3" + (error ? " alert-danger" : " invisible")}>
                    {error || "placeholder"}
                  </div>

                  <Button type="submit" disabled={loading || !newPassword} className="w-100 bv-btn-confirm" size="lg">
                    {loading ? <Spinner animation="border" size="sm" style={{ color: "var(--bg-deep)" }} /> : "Reset password"}
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default ResetPasswordPage;
