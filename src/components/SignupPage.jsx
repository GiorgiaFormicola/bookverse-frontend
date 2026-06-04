import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { Eye, EyeSlash, Book, People, Star, BarChartLine, InfoCircleFill, Search } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../config/api";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signUpCredentials, setSignUpCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    birthdate: "",
  });

  const maxAge = 120;
  const maxBirthdate = new Date();
  maxBirthdate.setDate(maxBirthdate.getDate() - 1);
  const minBirthdate = new Date();
  minBirthdate.setFullYear(minBirthdate.getFullYear() - maxAge);
  const maxDateInput = maxBirthdate.toISOString().split("T")[0];
  const minDateInput = minBirthdate.toISOString().split("T")[0];

  const validateForm = () => {
    const username = signUpCredentials.username;
    const email = signUpCredentials.email;
    const password = signUpCredentials.password;
    const confirmPassword = signUpCredentials.confirmPassword;
    const displayName = signUpCredentials.displayName;
    const birthdate = signUpCredentials.birthdate;

    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-z0-9_][a-z0-9_.]{1,29}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const birthdateValue = new Date(birthdate);

    if (username === null || username.trim() === "" || !usernameRegex.test(username)) {
      setError("Provide a valid username");
      return false;
    }

    if (displayName === null || displayName.trim() === "" || displayName.length < 2 || displayName.length > 50) {
      setError("Provide a valid displayname");
      return false;
    }

    if (email === null || email.trim() === "" || !emailRegex.test(email)) {
      setError("Provide a valid email");
      return false;
    }

    if (birthdate === null || birthdate.trim() === "" || isNaN(birthdateValue.getTime()) || birthdateValue < minBirthdate) {
      setError("Provide a valid date");
      return false;
    }

    if (birthdateValue > maxBirthdate) {
      setError("Birthdate must be in the past");
      return false;
    }

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

  const register = () => {
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    instance
      .post("/auth/register", {
        username: signUpCredentials.username,
        email: signUpCredentials.email,
        password: signUpCredentials.password,
        displayName: signUpCredentials.displayName,
        birthdate: signUpCredentials.birthdate,
      })
      .then(() => {
        navigate("/login", { state: { registered: true } });
      })
      .catch((err) => {
        if (err.handled) return;
        setError(err.response?.data?.message || "A server error occurred. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, []);

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient py-5">
      <Row className="justify-content-center w-100">
        <Col sm={12} md={11} lg={9} xl={8}>
          <Card className="bv-auth-card border-0 overflow-hidden">
            <Row className="g-0">
              {/* Desktop column */}
              <Col md={6} className="d-none d-md-flex auth-gradient p-5">
                <div className="d-flex flex-column justify-content-between h-100">
                  <div>
                    <div className="bv-brand d-flex align-items-center gap-3 mb-5">
                      <span className="bv-brand__icon">
                        <Book size={50} />
                      </span>
                      <span className="bv-brand__text fs-2">
                        Book <span className="bv-brand__accent">Verse</span>
                      </span>
                    </div>
                    <h2 className="mb-3" style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>
                      Join Our Community
                    </h2>
                    <p style={{ color: "rgba(236,235,245,0.7)" }}>
                      Start your reading journey today. Track your progress, share reviews, and discover your next favorite book.
                    </p>
                  </div>
                  <Row className="row-cols-1 gap-4 mt-4 flex-grow-1 py-5">
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <Search size={24} style={{ color: "var(--accent)" }} />
                        <div>
                          <strong style={{ fontFamily: "Space Grotesk" }}>Search & Discover</strong>
                          <p className="mb-0 small" style={{ color: "rgba(236,235,245,0.6)" }}>
                            Find your next favourite read
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <Star size={24} style={{ color: "var(--accent)" }} />
                        <div>
                          <strong style={{ fontFamily: "Space Grotesk" }}>Rate & Review</strong>
                          <p className="mb-0 small" style={{ color: "rgba(236,235,245,0.6)" }}>
                            Share your thoughts on books
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <People size={24} style={{ color: "var(--accent)" }} />
                        <div>
                          <strong style={{ fontFamily: "Space Grotesk" }}>Connect</strong>
                          <p className="mb-0 small" style={{ color: "rgba(236,235,245,0.6)" }}>
                            See what others are reading
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <BarChartLine size={24} style={{ color: "var(--accent)" }} />
                        <div>
                          <strong style={{ fontFamily: "Space Grotesk" }}>Track Progress</strong>
                          <p className="mb-0 small" style={{ color: "rgba(236,235,245,0.6)" }}>
                            Monitor your reading goals
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col sm={12} md={6} className="py-5 px-4 px-lg-5" style={{ background: "var(--surface-raised)" }}>
                {/* Mobile header */}
                <div className="mb-4 text-center d-md-none">
                  <div className="bv-brand d-flex flex-column align-items-center justify-content-center gap-2 mb-3">
                    <span className="bv-brand__icon">
                      <Book size={50} />
                    </span>
                    <span className="bv-brand__text fs-2">
                      Book<span className="bv-brand__accent">Verse</span>
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>Sign up</h2>
                </div>

                <h3 className="mb-4 d-none d-md-block" style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>
                  Create Account
                </h3>

                {/* Form */}
                <Form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    register();
                  }}
                >
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="d-flex align-items-center gap-2">
                      Username
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Tooltip className="custom-tooltip">
                            <strong>Username</strong> must be 2–30 characters long and can contain only lowercase letters, numbers, underscores and dots.
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
                      placeholder="Choose a username"
                      value={signUpCredentials.username}
                      onClick={() => setError("")}
                      onChange={(e) => setSignUpCredentials((prev) => ({ ...prev, username: e.target.value, displayName: e.target.value }))}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={signUpCredentials.email}
                      onClick={() => setError("")}
                      onChange={(e) => setSignUpCredentials({ ...signUpCredentials, email: e.target.value })}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="birthdate">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control
                      type="date"
                      min={minDateInput}
                      max={maxDateInput}
                      value={signUpCredentials.birthdate}
                      onClick={() => setError("")}
                      onChange={(e) => setSignUpCredentials({ ...signUpCredentials, birthdate: e.target.value })}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="d-flex align-items-center gap-2">
                      Password
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
                        <span style={{ display: "inline-flex", flexShrink: 0, cursor: "pointer" }}>
                          <InfoCircleFill />
                        </span>
                      </OverlayTrigger>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpCredentials.password}
                        onClick={() => setError("")}
                        onChange={(e) => setSignUpCredentials({ ...signUpCredentials, password: e.target.value })}
                        required
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
                        value={signUpCredentials.confirmPassword}
                        onClick={() => setError("")}
                        onChange={(e) => setSignUpCredentials({ ...signUpCredentials, confirmPassword: e.target.value })}
                        required
                        size="lg"
                      />
                      <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <div className={"alert bg-transparent text-center border-0 p-0 mb-3" + (error ? " alert-danger" : " invisible")} role="alert">
                    {error || "Error placeholder"}
                  </div>

                  <Button type="submit" disabled={loading} size="lg" className="w-100 bv-btn-confirm mb-3">
                    {loading ? <Spinner animation="border" size="sm" style={{ color: "var(--bg-deep)" }} /> : "Sign Up"}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                      Already have an account?
                    </p>
                    <Link to="/login" className="view-more-link fw-semibold">
                      Log In
                    </Link>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
