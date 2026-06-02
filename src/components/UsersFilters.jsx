import { Row, Col, Form, Button } from "react-bootstrap";
const UsersFilters = ({ filters, handleFilterChange, handleSearch }) => {
  return (
    <div className="bv-admin-filters mb-3">
      <Row className="g-3 pt-3">
        <Col md={6}>
          <Form.Control
            className="mb-2"
            placeholder="Search by username"
            value={filters.username}
            onChange={(e) => handleFilterChange("username", e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Control className="mb-2" placeholder="Search by email" value={filters.email} onChange={(e) => handleFilterChange("email", e.target.value)} />
        </Col>
        <Col md={6}>
          <Form.Select className="mb-3" value={filters.role} onChange={(e) => handleFilterChange("role", e.target.value)}>
            <option value="">All Roles</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select className="mb-3" value={filters.active} onChange={(e) => handleFilterChange("active", e.target.value)}>
            <option value="ALL">All Status</option>
            <option value={true}>ACTIVE</option>
            <option value={false}>SUSPENDED</option>
          </Form.Select>
        </Col>
        <Col md={12}>
          <Button className="w-100 bv-btn-confirm" onClick={() => handleSearch()}>
            Search
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default UsersFilters;
