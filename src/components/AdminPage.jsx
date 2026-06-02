import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import UsersSection from "./UsersSection";
import BooksSection from "./BooksSection";

const AdminPage = () => {
  return (
    <Container fluid className="py-4 px-3 container-lg">
      <Row className="mb-3">
        <Col>
          <h1 className="fw-bold">Admin Panel</h1>
          <p className="text-muted mb-0 fw-semibold">Manage users and books from a single panel</p>
        </Col>
      </Row>

      <Tabs justify defaultActiveKey="books" className="bv-tabs mb-3">
        <Tab eventKey="books" title="Books">
          <BooksSection />
        </Tab>
        <Tab eventKey="users" title="Users">
          <UsersSection />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPage;
