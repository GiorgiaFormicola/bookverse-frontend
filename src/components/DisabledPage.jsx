import { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { ShieldExclamation, EnvelopeFill, Book } from "react-bootstrap-icons";
import { instance } from "../config/api";

const DisabledPage = () => {
  const user = useSelector((state) => state.profile.user);
  const [savedEmail] = useState(user?.email || sessionStorage.getItem("disabledEmail") || "");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  const effectiveEmail = savedEmail || manualEmail;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleSend = () => {
    setError("");
    if (!emailRegex.test(effectiveEmail)) {
      setError("Provide a valid email");
      return;
    }
    setLoading(true);
    sessionStorage.removeItem("disabledEmail");
    instance
      .post("/auth/reactivation-request", { email: effectiveEmail })
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
        <Col sm={12} md={11} lg={9} xl={7}>
          <Card className="bv-auth-card border-0 p-4 py-5 px-lg-5">
            {sent ? (
              <div className="text-center d-flex flex-column align-items-center gap-3 py-4">
                <EnvelopeFill size={48} className="text-accent" />
                <h5>Request sent!</h5>
                <p className="mb-0 text-muted">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="bv-brand d-flex align-items-center justify-content-center gap-2 mb-5">
                    <span className="bv-brand__icon">
                      <Book size={30} className="text-accent" />
                    </span>
                    <span className="bv-brand__text">
                      Book<span className="bv-brand__accent">Verse</span>
                    </span>
                  </div>
                  <ShieldExclamation size={48} className="mb-3 text-toread" />
                  <h3>Account disabled</h3>
                  <p className="small mb-0 text-muted">Your account has been temporarily disabled by an administrator. You can request reactivation below.</p>
                </div>
                {!savedEmail && (
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={manualEmail}
                      onClick={() => setError("")}
                      onChange={(e) => {
                        setManualEmail(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && effectiveEmail) handleSend();
                      }}
                    />
                  </Form.Group>
                )}
                <div className={"alert text-center bg-transparent border-0 p-0 mb-3" + (error ? " alert-danger" : " invisible")}>{error || "placeholder"}</div>

                <Button className="w-100 bv-btn-confirm" size="lg" onClick={handleSend} disabled={loading || !effectiveEmail}>
                  {loading ? <Spinner animation="border" size="sm" style={{ color: "var(--bg-deep)" }} /> : "Request reactivation"}
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DisabledPage;
