import { Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
const DashboardCard = ({ statName, statValue, children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/" && (
        <Col xs={6} lg={3}>
          <Card className="px-1 py-2 px-sm-2 py-sm-3 px-md-4 py-md-4 px-lg-1 py-lg-0 py-xl-2 rounded-3">
            <Card.Body className="p-md-0 px-lg-3 py-lg-4">
              <div className="d-flex align-items-center justify-content-between">
                {children}
                <div className="text-end d-md-none d-lg-block">
                  <div className="text-muted mb-1">{statName}</div>
                  <div className="h2 mb-0">{statValue}</div>
                </div>
                <div className="text-end d-none d-md-block d-lg-none">
                  <div className="text-muted mb-1 fs-4">{statName}</div>
                  <div className="h1 mb-0">{statValue}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      )}

      {location.pathname === "/me" && (
        <Col xs={6} md={6} lg={3}>
          <Card className=" d-md-block py-sm-2 py-md-0 px-lg-0 rounded-3" /* ADD STAT-CARD CLASS */>
            <Card.Body className="py-sm-0 py-md-2 py-xl-2 p-xxl-3">
              <div className="d-flex align-items-center justify-content-between">
                {children}
                <div className="text-end d-md-none d-lg-block">
                  <div className="text-muted mb-1">{statName}</div>
                  <div className="h2 mb-0">{statValue}</div>
                </div>
                <div className="text-end d-none d-md-block d-lg-none">
                  <div className="text-muted mb-1 fs-5">{statName}</div>
                  <div className="h3 mb-0">{statValue}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      )}
    </>
  );
};

export default DashboardCard;
