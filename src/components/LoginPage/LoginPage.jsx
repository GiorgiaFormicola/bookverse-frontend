import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { Eye, EyeSlash, Book } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../config/api";
import { useDispatch } from "react-redux";
import { getProfileInfo } from "../../redux/actions";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const email = loginCredentials.email;
    const password = loginCredentials.password;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (email === null || email.trim() === "" || !emailRegex.test(email)) {
      setError("Provide a valid email");
      return false;
    }
    if (password === null || password.trim() === "" || !passwordRegex.test(password)) {
      setError("Provide a valid password");
      return false;
    }
    return true;
  };

  const login = () => {
    setError("");
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    instance
      .post("/auth/login", loginCredentials)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        dispatch(getProfileInfo());
        navigate("/");
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            setError("Wrong credentials supplied");
          } else {
            setError(err.response.data?.message || "A server error occurred. Please try again later.");
          }
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
                <div>
                  <Book size={64} className="mb-4" />
                  <h2 className="mb-3" /* ADD DISPLAY-FONT CLASS */>Welcome Back</h2>
                  <p className="mb-4 opacity-75">Your personal library awaits. Discover, read, and share your thoughts on thousands of books.</p>
                  <Row className="justify-content-between row-cols-3">
                    <Col /* ADD FETCH FOR INFO */>
                      <h3 className="h1 mb-0 text-nowrap">10K+</h3>
                      <small className="opacity-75">Books</small>
                    </Col>
                    <Col /* ADD FETCH FOR INFO */>
                      <h3 className="h1 mb-0 text-nowrap">5K+</h3>
                      <small className="opacity-75">Readers</small>
                    </Col>
                    <Col /* ADD FETCH FOR INFO */>
                      <h3 className="h1 mb-0 text-nowrap">20K+</h3>
                      <small className="opacity-75">Reviews</small>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col sm={12} md={6} className="p-5">
                <div className="mb-4 text-center d-md-none">
                  <Book color="#667DE9" size={55} className="text-primary mb-2" />

                  <h2 /* ADD DISPLAY-FONT CLASS */>Log in</h2>
                </div>

                <h3 className="mb-4 d-none d-md-block" /* ADD DISPLAY-FONT CLASS */>Log in</h3>

                <Form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    login();
                  }}
                >
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={loginCredentials.email}
                      onClick={() => setError("")}
                      onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginCredentials.password}
                        onClick={() => setError("")}
                        onChange={(e) =>
                          setLoginCredentials({
                            ...loginCredentials,
                            password: e.target.value,
                          })
                        }
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
                    <Button variant="primary" type="submit" disabled={loading} size="lg" className="border-0 w-100 auth-gradient" /* ADD AUTH-GRADIENT CLASS */>
                      {loading ? "Loading..." : "Log in"}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-muted mb-0">Don't have an account?</p>
                    <Link to="/signup" className="text-decoration-none text-light fw-semibold">
                      Sign Up
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

export default LoginPage;
