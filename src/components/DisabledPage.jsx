import { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { ShieldExclamation, EnvelopeFill, Book } from "react-bootstrap-icons";
import { instance } from "../config/api";

const DisabledPage = () => {
  const user = useSelector((state) => state.profile.user);
  const email = user?.email || sessionStorage.getItem("disabledEmail") || "";
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSend = () => {
    setLoading(true);
    setError(false);
    sessionStorage.removeItem("disabledEmail");
    instance
      .post("/auth/reactivation-request", { email })
      .then(() => setSent(true))
      .catch((err) => {
        if (err.handled) return;
        setError(true);
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
                <EnvelopeFill size={48} style={{ color: "var(--accent)" }} />
                <h5 style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>Request sent!</h5>
                <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                  We'll get back to you as soon as possible.
                </p>
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
                  <ShieldExclamation size={48} className="mb-3" style={{ color: "var(--st-toread)" }} />
                  <h3 style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>Account disabled</h3>
                  <p className="small mb-0" style={{ color: "var(--text-muted)" }}>
                    Your account has been temporarily disabled by an administrator. You can request reactivation below.
                  </p>
                </div>
                <div className={"alert text-center border-0 p-0 mb-3" + (error ? " alert-danger" : " invisible")}>
                  {error ? "Something went wrong. Try again." : "placeholder"}
                </div>
                <Button className="w-100 bv-btn-confirm" size="lg" onClick={handleSend} disabled={loading || !email}>
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
