import { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../config/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    status: null,
    message: "",
    errors: [],
  });

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const login = () => {
    setLoading(true);
    instance
      .post("/auth/login", loginCredentials)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          setErrorInfo({
            status: error.response.status,
            message: error.response.data.message,
            errors: error.response.data.errors ? error.response.data.errors : [],
          });
        } else {
          setErrorInfo({
            status: 500,
            message: "Something went wrong with the server, try again later!",
            errors: [],
          });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
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
                    onClick={() => {
                      setErrorInfo({ status: null, message: "", errors: [] });
                    }}
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
                      onClick={() => {
                        setErrorInfo({ status: null, message: "", errors: [] });
                      }}
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
                  visibility: errorInfo.message || errorInfo.errors.length ? "visible" : "hidden",
                }}
              >
                {errorInfo.errors.length > 0 &&
                  errorInfo.errors.map((error, i) => {
                    return (
                      <p key={`error-${i}`} className="my-0">
                        {error}
                      </p>
                    );
                  })}
                {errorInfo.message !== "" && errorInfo.errors.length == 0 && <p className="my-0">{errorInfo.message}</p>}
                {errorInfo.message === "" && (
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
  );
};

export default LoginPage;
