import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_PROFILE, SET_ERROR, CLEAR_ERROR } from "../../redux/actions";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoDisplayName, setAutoDisplayName] = useState(true);
  const error = useSelector((currentState) => currentState.error);

  const [signInCredentials, setSignInCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    birthdate: "",
  });

  const setError = (body) => {
    dispatch({
      type: SET_ERROR,
      payload: body,
    });
  };

  const validateSignInCredentials = (signInCredentials) => {
    if (
      signInCredentials.username.trim() === "" ||
      signInCredentials.email.trim() === "" ||
      signInCredentials.password.trim() === "" ||
      signInCredentials.confirmPassword.trim() === "" ||
      signInCredentials.displayName.trim() === "" ||
      signInCredentials.birthdate === ""
    ) {
      setError({
        status: 400,
        message: "To continue you must provide all the required info",
        errorsList: [],
      });
      return false;
    }
    if (signInCredentials.password !== signInCredentials.confirmPassword) {
      setError({
        status: 400,
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
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const deleteError = () => {
    if (error.isPresent) {
      dispatch({
        type: CLEAR_ERROR,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      dispatch({
        type: CLEAR_PROFILE,
      });
    }
  }, []);

  useEffect(() => {
    deleteError();
  }, []);

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-align-content-between py-5">
      <Row className="justify-content-center align-items-center text-center mt-5 pt-5">
        <Col xs={1}>
          <img className="rounded-pill img-fluid" src="https://placecats.com/200/200" alt="logo" />
        </Col>
        <Col xs={12}>
          <h1>Enjoy our community!</h1>
        </Col>
      </Row>
      <Row className="flex-grow-1 justify-content-center">
        <Col xs={7} sm={8} md={6} lg={5} xl={4} xxl={4} className="d-flex flex-column justify-content-center py-3">
          {loading && (
            <div className="text-center">
              <Spinner animation="border"></Spinner>
            </div>
          )}

          {!loading && (
            <>
              <Form
                className=" fw-semibold small"
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
                    onClick={() => deleteError()}
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
                    onClick={() => deleteError()}
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
                    onClick={() => deleteError()}
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
                    onClick={() => deleteError()}
                    onChange={(e) => setSignInCredentials({ ...signInCredentials, birthdate: e.target.value })}
                  />
                  <Form.Label className="mt-3">E-mail</Form.Label>
                  <Form.Control
                    className=""
                    type="email"
                    placeholder="Type your email here"
                    value={signInCredentials.email}
                    onClick={() => deleteError()}
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
                      onClick={() => deleteError()}
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
                      onClick={() => deleteError()}
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
              <div
                className="small text-center d-flex flex-column flex-grow-1 justify-content-center"
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
          <p className=" text-light opacity-75">You already have an account?</p>
          <Link to="/login" className=" fw-semibold">
            Login
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;
