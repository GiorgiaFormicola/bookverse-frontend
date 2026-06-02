import { Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
const DashboardCard = ({ statName, statValue, children, color }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/" && (
        <Col xs={6} lg={3}>
          <div className={`bv-stat-card bv-stat-card--${color}`}>
            <div className="bv-stat-card__icon">{children}</div>
            <div className="bv-stat-card__body">
              <div className="bv-stat-card__label mb-1">{statName}</div>
              <div className="bv-stat-card__value">{statValue}</div>
            </div>
          </div>
        </Col>
      )}
      {location.pathname === "/me" && (
        <Col xs={6} lg={3}>
          <div className={`bv-stat-card bv-stat-card--${color} px-lg-3`}>
            <div className="bv-stat-card__icon">{children}</div>
            <div className="bv-stat-card__body">
              <div className="bv-stat-card__label mb-1">{statName}</div>
              <div className="bv-stat-card__value">{statValue}</div>
            </div>
          </div>
        </Col>
      )}

      {/* {location.pathname === "/me" && (
        <Col xs={6} md={6} lg={3}>
          <Card className=" d-md-block py-sm-2 py-md-0 px-lg-0 rounded-3">
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
      )} */}
    </>
  );
};

export default DashboardCard;
