import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Spinner, Card } from "react-bootstrap";
import { Eye, EyeSlash, Book } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_PROFILE, CLEAR_ERROR, getProfileInfo } from "../../redux/actions";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /* const error = useSelector((currentState) => currentState.error); */
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const login = () => {
    setError("");
    setLoading(true);
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

  /* const login = () => {
    setLoading(true);
    instance
      .post("/auth/login", loginCredentials)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        dispatch(getProfileInfo());
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }; */

  /* const deleteError = () => {
    if (error.isPresent) {
      dispatch({
        type: CLEAR_ERROR,
      });
    }
  }; */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      dispatch({
        type: CLEAR_PROFILE,
      });
    }
  }, []);

  /* useEffect(() => {
    deleteError();
  }, []); */

  /* return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-between py-5">
      <Row className="justify-content-center align-items-center text-center mt-5 pt-5">
        <Col xs={1}>
          <img className="rounded-pill img-fluid" src="https://placecats.com/200/200" alt="logo" />
        </Col>
        <Col xs={12}>
          <h1>Welcome back!</h1>
        </Col>
      </Row>
      <Row className="flex-grow-1 justify-content-center">
        <Col xs={7} sm={8} md={6} lg={5} xl={4} xxl={4} className="d-flex flex-column justify-content-center">
          {loading && (
            <div className="text-center">
              <Spinner animation="border"></Spinner>
            </div>
          )}

          {!loading && (
            <>
              <Form
                className=" fw-semibold py-3 small"
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    className=""
                    type="email"
                    placeholder="Type your email here"
                    value={loginCredentials.email}
                    onClick={() => deleteError()}
                    onChange={(e) => {
                      setLoginCredentials({
                        ...loginCredentials,
                        email: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Type your password here"
                      value={loginCredentials.password}
                      onClick={() => deleteError()}
                      onChange={(e) => {
                        setLoginCredentials({
                          ...loginCredentials,
                          password: e.target.value,
                        });
                      }}
                    />
                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Button disabled={loading} className=" fw-semibold text-dark bg-accent border-0 rounded-pill w-100 py-2 fs-5" type="submit">
                  Log in
                </Button>
              </Form>
              <div
                className="small text-center d-flex flex-column justify-content-center"
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
            </>
          )}
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center text-center mb-5 pb-5">
        <Col>
          <p className=" text-light opacity-75">You don't have an account yet?</p>
          <Link to="/signIn" className=" fw-semibold">
            Sign In
          </Link>
        </Col>
      </Row>
    </Container>
  ); */
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

                  <h2 /* ADD DISPLAY-FONT CLASS */>Login</h2>
                </div>

                <h3 className="mb-4 d-none d-md-block" /* ADD DISPLAY-FONT CLASS */>Login</h3>

                <Form
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
                      /* onClick={() => setError("")} */
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
                        /* onClick={() => setError("")} */
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

                  {error && (
                    <div className="alert alert-danger text-center" role="alert">
                      {error}
                    </div>
                  )}

                  {!error && (
                    <div className="alert alert-danger text-center visually-hidden" role="alert">
                      Wrong credentials supplied
                    </div>
                  )}

                  <div className="gap-2 mb-3" /* ADD D-GRID CLASS */>
                    <Button variant="primary" type="submit" disabled={loading} size="lg" className="border-0 w-100 auth-gradient" /* ADD AUTH-GRADIENT CLASS */>
                      {loading ? "Loading..." : "Login"}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-muted mb-0">Don't have an account?</p>
                    <Link to="/signIn" className="text-decoration-none">
                      Sign In
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
