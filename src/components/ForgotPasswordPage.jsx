import { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Book, EnvelopeFill } from "react-bootstrap-icons";
import { instance } from "../config/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (email === null || email.trim() === "" || !emailRegex.test(email)) {
      setError("Provide a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!validateEmail()) {
      setLoading(false);
      return;
    }
    instance
      .post("/auth/forgot-password", { email })
      .then(() => setSent(true))
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        setError(err.response?.data?.message || "Something went wrong. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="border-0 shadow-lg p-4">
            {sent ? (
              <div className="text-center d-flex flex-column align-items-center gap-3 py-3">
                <EnvelopeFill size={48} className="text-success" />
                <p className="mb-0">Check your inbox! We sent you a link to reset your password.</p>
                <Link to="/login" className="text-decoration-none text-light fw-semibold view-more-link">
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <Book size={48} className="text-primary mb-2" />
                  <h3>Forgot password</h3>
                  <p className="text-muted small mb-0">Enter your email and we'll send you a reset link</p>
                </div>
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      size="lg"
                    />
                  </Form.Group>
                  <div className={"alert alert-danger text-center bg-transparent border-0 p-0 mb-3" + (error ? "" : " invisible")}>
                    {error || "placeholder"}
                  </div>
                  <Button type="submit" disabled={loading || !email} className="w-100 auth-gradient border-0" size="lg">
                    {loading ? <Spinner animation="border" size="sm" /> : "Send reset link"}
                  </Button>
                  <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none text-muted small">
                      Back to login
                    </Link>
                  </div>
                </Form>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordPage;
