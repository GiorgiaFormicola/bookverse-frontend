import { Card, Row, Col, Form, Button } from "react-bootstrap";
const BooksFilters = ({ filters, handleFilterChange, handleSearch }) => {
  return (
    <Card className="mb-3 shadow-sm border-0 rounded-4">
      <Card.Body>
        <Row className="g-3">
          <Col md={3}>
            <Form.Control placeholder="Search title" value={filters.title} onChange={(e) => handleFilterChange("title", e.target.value)} />
          </Col>

          <Col md={3}>
            <Form.Control placeholder="Search author" value={filters.author} onChange={(e) => handleFilterChange("author", e.target.value)} />
          </Col>

          <Col md={3}>
            <Form.Control placeholder="Search publisher" value={filters.publisher} onChange={(e) => handleFilterChange("publisher", e.target.value)} />
          </Col>

          <Col md={3}>
            <Form.Check
              type="checkbox"
              label="Missing Cover"
              checked={filters.missingCoverURL}
              onChange={(e) => handleFilterChange("missingCoverURL", e.target.checked)}
            />

            <Form.Check
              type="checkbox"
              label="Missing Authors"
              checked={filters.missingAuthor}
              onChange={(e) => handleFilterChange("missingAuthor", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Missing Publisher"
              checked={filters.missingPublisher}
              onChange={(e) => handleFilterChange("missingPublisher", e.target.checked)}
            />

            <Form.Check
              type="checkbox"
              label="Missing Published Date"
              checked={filters.publishedDate}
              onChange={(e) => handleFilterChange("missingPublishedDate", e.target.checked)}
            />

            <Form.Check
              type="checkbox"
              label="Missing Categories"
              checked={filters.missingCategory}
              onChange={(e) => handleFilterChange("missingCategory", e.target.checked)}
            />

            <Form.Check
              type="checkbox"
              label="Missing Description"
              checked={filters.missingDescription}
              onChange={(e) => handleFilterChange("missingDescription", e.target.checked)}
            />

            <Form.Check
              type="checkbox"
              label="Missing Pages"
              checked={filters.missingPages}
              onChange={(e) => handleFilterChange("missingPages", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Missing ISBN-10"
              checked={filters.missingIsbn10}
              onChange={(e) => handleFilterChange("missingIsbn10", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Missing ISBN-13"
              checked={filters.missingIsbn13}
              onChange={(e) => handleFilterChange("missingIsbn13", e.target.checked)}
            />
          </Col>

          <Col md={12} className="d-flex justify-content-end">
            <Button variant="primary" onClick={() => handleSearch()}>
              Search
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BooksFilters;
