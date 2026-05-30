import { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import { ShieldExclamation, EnvelopeFill } from "react-bootstrap-icons";
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
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center d-flex flex-column align-items-center gap-3" style={{ maxWidth: 420 }}>
        <ShieldExclamation size={64} className="text-warning" />
        <h3 className="mb-0">Your account has been disabled</h3>
        <p className="text-muted mb-0">Your account has been temporarily disabled by an administrator. You can request more information by contacting us.</p>

        {sent ? (
          <div className="d-flex flex-column align-items-center gap-2 text-success">
            <EnvelopeFill size={32} />
            <p className="mb-0">Request sent! We'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <>
            {error && <p className="text-danger small mb-0">Something went wrong. Try again.</p>}
            <Button variant="primary" className="rounded-pill px-4" onClick={handleSend} disabled={loading || !email}>
              {loading ? <Spinner animation="border" size="sm" /> : "Request reactivation"}
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default DisabledPage;
