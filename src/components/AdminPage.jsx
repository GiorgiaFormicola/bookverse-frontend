import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import UsersSection from "./UsersSection";
import BooksSection from "./BooksSection";

const AdminPage = () => {
  return (
    <Container fluid className="py-4 px-3 container-lg">
      <Row className="mb-2">
        <Col>
          <h1 className="fw-bold">Admin Panel</h1>
          <p className="text-muted mb-0">Manage users and books from a single panel</p>
        </Col>
      </Row>

      <Tabs justify defaultActiveKey="books">
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
