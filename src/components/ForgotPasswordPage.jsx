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
        if (err.handled) return;
        setError(err.response?.data?.message || "Something went wrong. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center auth-gradient">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={11} lg={9} xl={7}>
          <Card className="bv-auth-card border-0 px-4 px-lg-5 py-5">
            {sent ? (
              <div className="text-center d-flex flex-column align-items-center gap-3 py-3">
                <EnvelopeFill size={48} style={{ color: "var(--accent)" }} />
                <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                  Check your inbox! We sent you a link to reset your password.
                </p>
                <Link to="/login" className="view-more-link fw-semibold">
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="bv-brand d-flex align-items-center justify-content-center gap-2 mb-3">
                    <span className="bv-brand__icon">
                      <Book size={30} className="text-accent" />
                    </span>
                    <span className="bv-brand__text">
                      Book<span className="bv-brand__accent">Verse</span>
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>Forgot password</h3>
                  <p className="small mb-0" style={{ color: "var(--text-muted)" }}>
                    Enter your email and we'll send you a reset link
                  </p>
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

                  <div className={"alert bg-transparent text-center border-0 p-0 mb-3" + (error ? " alert-danger" : " invisible")}>
                    {error || "placeholder"}
                  </div>

                  <Button type="submit" disabled={loading || !email} className="w-100 bv-btn-confirm mb-3" size="lg">
                    {loading ? <Spinner animation="border" size="sm" style={{ color: "var(--bg-deep)" }} /> : "Send reset link"}
                  </Button>

                  <div className="text-center">
                    <Link to="/login" className="view-more-link small fw-semibold">
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
