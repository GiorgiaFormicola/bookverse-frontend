import { Col, Card } from "react-bootstrap";
const DashboardCard = ({ statName, statValue, children }) => {
  return (
    <Col xs={6} lg={3}>
      <Card className="px-1 py-2 px-sm-2 py-sm-3 px-md-4 py-md-4 px-lg-1 py-lg-3 rounded-3" /* ADD STAT-CARD CLASS */>
        <Card.Body>
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
  );
};

export default DashboardCard;
