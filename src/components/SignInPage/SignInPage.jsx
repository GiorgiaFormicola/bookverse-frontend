import { use, useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../config/api";

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    status: null,
    message: "",
    errors: [],
  });

  const [signInCredentials, setSignInCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    birthdate: "",
  });

  const [autoDisplayName, setAutoDisplayName] = useState(true);

  const validateSignInCredentials = (signInCredentials) => {
    if (
      signInCredentials.username.trim() === "" ||
      signInCredentials.email.trim() === "" ||
      signInCredentials.password.trim() === "" ||
      signInCredentials.confirmPassword.trim() === "" ||
      signInCredentials.displayName.trim() === "" ||
      signInCredentials.birthdate === ""
    ) {
      setErrorInfo({
        status: null,
        message: "To continue you must provide all the required info",
        errors: [],
      });
      return false;
    }
    if (signInCredentials.password !== signInCredentials.confirmPassword) {
      setErrorInfo({
        status: null,
        message: "To continue passwords must match",
        errors: [],
      });
      return false;
    }
    return true;
  };

  const login = () => {
    setLoading(true);
    if (validateSignInCredentials(signInCredentials) === false) {
      setLoading(false);
      return;
    }
    instance
      .post("/auth/register", {
        username: signInCredentials.username,
        email: signInCredentials.email,
        password: signInCredentials.password,
        displayName: signInCredentials.displayName,
        birthdate: signInCredentials.birthdate,
      })
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response);
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
    <Container className="vh-100 d-flex flex-column justify-content-center ">
      <Row className="justify-content-center">
        <Col xs={7} sm={8} md={6} lg={5} xl={4} xxl={4}>
          <div className="text-center">
            <img className="rounded-pill img-fluid" src="https://placecats.com/200/200" alt="logo" />
            <h1 className="">Enjoy our community!</h1>
          </div>
          <div className="d-flex flex-column justify-content-center" style={{ height: "42rem" }}>
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
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      className=""
                      type="text"
                      placeholder="Type your username here"
                      value={signInCredentials.username}
                      onClick={() => {
                        setErrorInfo({ status: null, message: "", errors: [] });
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSignInCredentials((prev) => ({
                          ...prev,
                          username: value,
                          displayName: autoDisplayName ? value : prev.displayName,
                        }));
                      }}
                    />
                    <Form.Check
                      className="mt-3 mb-2"
                      type="checkbox"
                      label="Custom display name"
                      checked={!autoDisplayName}
                      onClick={() => {
                        setErrorInfo({ status: null, message: "", errors: [] });
                      }}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAutoDisplayName(!checked);
                        if (!checked) {
                          setSignInCredentials((prev) => ({
                            ...prev,
                            displayName: prev.username,
                          }));
                        }
                      }}
                    />
                    <Form.Control
                      disabled={autoDisplayName}
                      className=""
                      type="text"
                      placeholder="Type the name you want to show here"
                      value={signInCredentials.displayName}
                      onClick={() => {
                        setErrorInfo({ status: null, message: "", errors: [] });
                      }}
                      onChange={(e) => {
                        setSignInCredentials({
                          ...signInCredentials,
                          displayName: e.target.value,
                        });
                      }}
                    />
                    <Form.Label className="mt-3">Birthdate</Form.Label>
                    <Form.Control
                      type="date"
                      value={signInCredentials.birthdate}
                      onClick={() => {
                        setErrorInfo({ status: null, message: "", errors: [] });
                      }}
                      onChange={(e) => setSignInCredentials({ ...signInCredentials, birthdate: e.target.value })}
                    />
                    <Form.Label className="mt-3">E-mail</Form.Label>
                    <Form.Control
                      className=""
                      type="email"
                      placeholder="Type your email here"
                      value={signInCredentials.email}
                      onClick={() => {
                        setErrorInfo({ status: null, message: "", errors: [] });
                      }}
                      onChange={(e) => setSignInCredentials({ ...signInCredentials, email: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Type your password here"
                        value={signInCredentials.password}
                        onClick={() => {
                          setErrorInfo({ status: null, message: "", errors: [] });
                        }}
                        onChange={(e) => setSignInCredentials({ ...signInCredentials, password: e.target.value })}
                      />
                      <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Type again your password here"
                        value={signInCredentials.confirmPassword}
                        onClick={() => {
                          setErrorInfo({ status: null, message: "", errors: [] });
                        }}
                        onChange={(e) => setSignInCredentials({ ...signInCredentials, confirmPassword: e.target.value })}
                      />
                      <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Button disabled={loading} className=" fw-semibold text-dark bg-accent border-0 rounded-pill w-100 py-2 fs-5" type="submit">
                    Sign in
                  </Button>
                </Form>
                <div className="small text-center d-flex flex-column justify-content-center" style={{ height: "5.5rem" }}>
                  {errorInfo.message !== "" &&
                    errorInfo.errors.length > 0 &&
                    errorInfo.errors.map((error, i) => {
                      return (
                        <p key={`error-${i}`} className="my-0">
                          {error}
                        </p>
                      );
                    })}

                  {errorInfo.message !== "" && errorInfo.errors.length == 0 && <p className="my-0">{errorInfo.message}</p>}
                </div>
              </>
            )}
          </div>

          <div className="text-center py-2">
            <p className=" text-light opacity-75">You already have an account?</p>
            <Link to="/login" className=" fw-semibold">
              Login
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;
