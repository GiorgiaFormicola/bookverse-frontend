import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { Eye, EyeSlash, Book } from "react-bootstrap-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { instance } from "../config/api";
import { useDispatch } from "react-redux";
import { getProfileInfo } from "../redux/actions";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearMessages = () => {
    setError("");
    if (location.state?.passwordReset) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  };

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
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
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
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient">
      <Row className="justify-content-center w-100">
        <Col sm={12} md={11} lg={9} xl={7}>
          <Card className="bv-auth-card border-0 overflow-hidden">
            <Row className="g-0">
              {/* Colonna sinistra — solo desktop */}
              <Col md={6} className="d-none d-md-flex auth-gradient p-5">
                <div className="d-flex flex-column justify-content-between h-100">
                  <div>
                    <div className="bv-brand d-flex align-items-center gap-3 mb-5">
                      <span className="bv-brand__icon">
                        <Book size={50} />
                      </span>
                      <span className="bv-brand__text fs-2">
                        Book<span className="bv-brand__accent">Verse</span>
                      </span>
                    </div>
                    <h2 className="mb-3" style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>
                      Welcome Back
                    </h2>
                    <p style={{ color: "rgba(236,235,245,0.7)" }}>
                      Your personal library awaits. Discover, read, and share your thoughts on thousands of books.
                    </p>
                  </div>
                  <Row className="justify-content-between row-cols-3 mt-4">
                    <Col>
                      <h3 className="h1 mb-0 text-nowrap" style={{ fontFamily: "Space Grotesk", color: "var(--accent)" }}>
                        10K+
                      </h3>
                      <small style={{ color: "rgba(236,235,245,0.6)" }}>Books</small>
                    </Col>
                    <Col>
                      <h3 className="h1 mb-0 text-nowrap" style={{ fontFamily: "Space Grotesk", color: "var(--accent)" }}>
                        5K+
                      </h3>
                      <small style={{ color: "rgba(236,235,245,0.6)" }}>Readers</small>
                    </Col>
                    <Col>
                      <h3 className="h1 mb-0 text-nowrap" style={{ fontFamily: "Space Grotesk", color: "var(--accent)" }}>
                        20K+
                      </h3>
                      <small style={{ color: "rgba(236,235,245,0.6)" }}>Reviews</small>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Colonna destra — form */}
              <Col sm={12} md={6} className="p-5" style={{ background: "var(--surface-raised)" }}>
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
                  <h2 style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>Log in</h2>
                </div>

                <h3 className="mb-4 d-none d-md-block" style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>
                  Log in
                </h3>

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
                      onClick={() => clearMessages()}
                      onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginCredentials.password}
                        onClick={() => clearMessages()}
                        onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                        required
                        size="lg"
                      />
                      <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <div className="text-end mb-3">
                    <Link to="/forgot-password" className="text-decoration-none small view-more-link fw-semibold">
                      Forgot your password?
                    </Link>
                  </div>

                  <div
                    className={
                      "alert text-center bg-transparent border-0 p-0 mb-3" +
                      (error || location.state?.passwordReset ? "" : " invisible") +
                      (error ? " alert-danger" : " alert-success")
                    }
                    role="alert"
                  >
                    {error ? error : location.state?.passwordReset ? "Password reset successfully" : "placeholder"}
                  </div>

                  <Button type="submit" disabled={loading} size="lg" className="w-100 bv-btn-confirm mb-3">
                    {loading ? "Loading..." : "Log in"}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                      Don't have an account?
                    </p>
                    <Link to="/signup" className="view-more-link fw-semibold">
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
