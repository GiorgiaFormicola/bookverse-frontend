import { Container, Row, Col, Card } from "react-bootstrap";

import { WifiOff, ExclamationTriangle } from "react-bootstrap-icons";
import { RESET_AUTH } from "../redux/actions";
import { useDispatch } from "react-redux";

const ErrorPage = () => {
  const dispatch = useDispatch();
  const type = new URLSearchParams(window.location.search).get("type");
  const isNetwork = type === "network";

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="bv-auth-card border-0 p-4 text-center">
            {isNetwork ? (
              <WifiOff size={48} className="mx-auto mb-3" style={{ color: "var(--st-toread)" }} />
            ) : (
              <ExclamationTriangle size={48} className="mx-auto mb-3" style={{ color: "var(--st-review)" }} />
            )}
            <h3 style={{ fontFamily: "Space Grotesk", fontWeight: 700 }}>{isNetwork ? "Connection error" : "Server error"}</h3>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>
              {isNetwork ? "Check your internet connection and try again." : "Something went wrong on our end. Please try again later."}
            </p>
            <button
              className="bv-btn-confirm btn w-100"
              onClick={() => {
                dispatch({ type: RESET_AUTH });
                window.location.replace("/");
              }}
            >
              Go back to homepage
            </button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
