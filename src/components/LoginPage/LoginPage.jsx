import { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  /* const login = () => {
    fetch("http://localhost:5174/auth/login", {
      method: "POST",
      body: JSON.stringify(loginCredentials),
      headers: {
        "Content-Type": "application/json ",
      },
    })
      .then((response) => {
        if (response.ok) {
          setLoginCredentials({
            email: "",
            password: "",
          });
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((res) => {
        localStorage.setItem("token", res.token);
        navigate("/homepage");
      })
      .catch((error) => console.log(error));
  }; */

  const login = () => {
    fetch("http://localhost:5174/auth/login", {
      method: "POST",
      body: JSON.stringify(loginCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            if (response.status == 400) {
              throw new Error(`${response.status} - ${data.message} - ${data.errors.join(", ")}`);
            } else {
              throw new Error(`${response.status} - ${data.message}`);
            }
          }
          localStorage.setItem("token", data.token);
          navigate("/");
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container className="vh-100 d-flex flex-column justify-content-center">
      <Row className="justify-content-center">
        <Col xs={4}>
          <div className="text-center">
            <img className="rounded-pill" src="https://placecats.com/200/200" alt="logo" />
            <h1 className="">Welcome back!</h1>
          </div>
          <Form
            className=" fw-semibold pt-3 pb-5 small"
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
            <Button className=" fw-semibold text-dark bg-accent border-0 rounded-pill w-100 py-2 fs-5" type="submit">
              Log in
            </Button>
          </Form>
          <div className="text-center">
            <p className=" text-light opacity-75">You don't have an account yet?</p>
            <Link to="/signIn" className=" fw-semibold">
              Sign In
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
