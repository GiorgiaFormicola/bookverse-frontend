import { Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
const DashboardCard = ({ statName, statValue, children, color }) => {
  const location = useLocation();

  return (
    <>
      <Col xs={6} lg={3}>
        <div className={`bv-stat-card bv-stat-card--${color} ${location.pathname === "/me" ? "px-lg-3" : ""}`}>
          <div className="bv-stat-card__icon">{children}</div>
          <div className="bv-stat-card__body">
            <div className="bv-stat-card__label mb-1">{statName}</div>
            <div className="bv-stat-card__value">{statValue}</div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default DashboardCard;
