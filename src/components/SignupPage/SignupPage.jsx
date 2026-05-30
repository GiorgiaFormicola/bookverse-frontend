import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, EyeSlash, Book, People, Star, BarChartLine, InfoCircleFill, Search } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../config/api";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  /*  const [autoDisplayName, setAutoDisplayName] = useState(true); */
  const [signUpCredentials, setSignUpCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    birthdate: "",
  });

  const minAge = 13;
  const maxAge = 120;
  const maxBirthdate = new Date();
  maxBirthdate.setFullYear(maxBirthdate.getFullYear() - minAge);
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
      setError("To continue you must be at least 13 years old");
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
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data?.message || "A server error occurred. Please try again later.");
        } else {
          setError("A network error occurred. Please try again later.");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, []);

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient" /* ADD AUTH-GRADIENT CLASS */>
      <Row className="justify-content-center">
        <Col sm={12} md={11} lg={9}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <Row className="g-0">
              <Col md={6} className="d-none d-md-block bg-secondary text-white p-5 auth-gradient" /* ADD AUTH-GRADIENT CLASS */>
                <div className="h-100 d-flex flex-column justify-content-between">
                  <div>
                    <Book size={64} className="mb-4" />

                    <h2 className="mb-3" /* ADD DISPLAY-FONT CLASS */>Join Our Community</h2>
                    <p className="mb-4 opacity-75">
                      Start your reading journey today. <br></br> Track your progress, share reviews, and discover your next favorite book.
                    </p>
                  </div>
                  <Row className="row-cols-1 h-50 my-auto gap-4">
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <Search size={32} />
                        <div>
                          <strong className="h5">Search & Discover</strong>
                          <p className="mb-0  opacity-75"> Find your next favourite read</p>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <Star size={32} />
                        <div>
                          <strong className="h5">Rate & Review</strong>
                          <p className="mb-0  opacity-75">Share your thoughts on books</p>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <People size={32} />
                        <div>
                          <strong className="h5">Connect</strong>
                          <p className="mb-0 opacity-75">See what others are reading</p>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center gap-3">
                        <BarChartLine size={32} />
                        <div>
                          <strong className="h5">Track Progress</strong>
                          <p className="mb-0 opacity-75">Monitor your reading goals</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col sm={12} md={6} className="p-5">
                <div className="mb-4 text-center d-md-none">
                  <Book color="#667DE9" size={55} className="text-primary mb-2" />

                  <h2 /* ADD DISPLAY-FONT CLASS */>Sign up</h2>
                </div>

                <h3 className="mb-4 d-none d-md-block" /* ADD DISPLAY-FONT CLASS */>Create Account</h3>

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
                        key="username"
                        placement="right"
                        overlay={
                          <Tooltip id="username-tooltip" className="custom-tooltip">
                            <strong>Username</strong> must be 2–30 characters long and can contain lowercase letters, numbers, underscores and dots. It cannot
                            end with a dot or contain consecutive dots.
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
                      value={signUpCredentials.username}
                      onClick={() => setError("")}
                      onChange={(e) => {
                        setSignUpCredentials((prev) => ({
                          ...prev,
                          username: e.target.value,
                          displayName: e.target.value,
                          /* displayName: autoDisplayName ? e.target.value : prev.displayName, */
                        }));
                      }}
                      required
                      size="lg"
                    />
                  </Form.Group>
                  {/* <Form.Group className="mb-3" controlId="displayName">
                    <Form.Check
                      className="mb-2"
                      type="checkbox"
                      label="Custom name to display"
                      checked={!autoDisplayName}
                      onClick={() => setError("")}
                      onChange={(e) => {
                        setAutoDisplayName(!e.target.checked);
                        if (!e.target.checked) {
                          setSignUpCredentials((prev) => ({
                            ...prev,
                            displayName: prev.username,
                          }));
                        }
                      }}
                    />
                    <Form.Control
                      className="py-2"
                      disabled={autoDisplayName}
                      type="text"
                      placeholder="Choose a name to display"
                      value={signUpCredentials.displayName}
                      onClick={() => setError("")}
                      onChange={(e) => {
                        setSignUpCredentials({
                          ...signUpCredentials,
                          displayName: e.target.value,
                        });
                      }}
                    />
                  </Form.Group> */}
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
                      placeholder="Enter your email"
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
                        key="password"
                        placement="right"
                        overlay={
                          <Tooltip id="password-tooltip" className="custom-tooltip">
                            <strong>Password</strong> must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one
                            number and one special character.
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

                  <div className={"alert alert-danger text-center bg-transparent border-0 p-0" + (error ? "" : " invisible")} role="alert">
                    {error ? error : "Error placeholder"}
                  </div>

                  <div className="gap-2 mb-3">
                    <Button variant="primary" type="submit" disabled={loading} size="lg" className="border-0 w-100 auth-gradient">
                      {loading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-muted mb-0">Already have an account?</p>
                    <Link to="/login" className="text-decoration-none text-light fw-semibold">
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
