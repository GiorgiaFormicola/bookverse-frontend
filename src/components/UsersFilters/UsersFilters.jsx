import { Card, Row, Col, Form, Button } from "react-bootstrap";
const UsersFilters = ({ filters, handleFilterChange, handleSearch }) => {
  return (
    <Card className="mb-3 shadow-sm border-0 rounded-4 p-2">
      <Card.Body>
        <Row className="g-3 g-md-4">
          <Col md={6} className=" order-md-0">
            <Form.Control placeholder="Search by username" value={filters.username} onChange={(e) => handleFilterChange("username", e.target.value)} />
          </Col>
          <Col md={6} className=" order-md-3">
            <Form.Control placeholder="Search by email" value={filters.email} onChange={(e) => handleFilterChange("email", e.target.value)} />
          </Col>

          <Col md={6} className=" order-md-1">
            <Form.Select value={filters.role} onChange={(e) => handleFilterChange("role", e.target.value)}>
              <option value="">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </Form.Select>
          </Col>
          <Col md={6} className=" order-md-4">
            <Form.Select value={filters.active} onChange={(e) => handleFilterChange("active", e.target.value)}>
              <option value="ALL">All Status</option>
              <option value={true}>ACTIVE</option>
              <option value={false}>SUSPENDED</option>
            </Form.Select>
          </Col>
          <Col md={12} className="d-flex order-md-5">
            <Button className="w-100" variant="primary" onClick={() => handleSearch()}>
              Search
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UsersFilters;
