import { useEffect, useState } from "react";
import { instance } from "../../config/api";
import { Row, Col, Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowClockwise } from "react-bootstrap-icons";
import { ChevronRight } from "lucide-react";
import BookCard from "../BookCard/BookCard";

const HomePageSection = ({ filter, title, loading, setLoading, onEmpty }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(false);

  const getSectionBooks = () => {
    instance
      .get("/me/books?size=6&order=title&status=" + filter)
      .then((response) => {
        setBooks(response.data.content);
        if (response.data.content.length === 0) onEmpty?.();
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getSectionBooks();
  }, []);

  if (!loading && !error && books.length === 0) return null;

  return (
    <Row className="g-2 mb-lg-4 home-section-fade">
      <Col xs={12}>
        <div className="d-flex align-items-center justify-content-between">
          <h2>{title}</h2>
          {!loading && !error && (
            <Link to={`/library?status=${filter}`} className="view-more-link text-muted text-decoration-none d-flex align-items-center gap-1">
              View more
              <span>
                <ChevronRight size={20} strokeWidth={2} />
              </span>
            </Link>
          )}
        </div>
      </Col>

      <Col className="overflow-auto hide-scrollbar">
        <Row className="flex-nowrap pe-sm-5 pe-lg-0 g-3 pt-1">
          {error ? (
            <Col xs={8} lg={12} className="mx-auto">
              <Alert
                variant="secondary"
                className="d-flex flex-column align-items-center justify-content-between mb-0 rounded-3 gap-3 py-4 bg-transparent border-0"
              >
                <span>Something went wrong loading this section.</span>
                <div className="d-flex flex-column align-items-center gap-2">
                  <span className="fw-bold">Try again</span>
                  <ArrowClockwise
                    size={30}
                    onClick={() => {
                      setError(false);
                      setLoading(true);
                      getSectionBooks();
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Alert>
            </Col>
          ) : loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Col key={i} xs={6} sm={5} md={3} lg={2}>
                <Card className="bg-transparent border-0">
                  <div className="placeholder-glow rounded-3 book-cover">
                    <div className="placeholder rounded-3 w-100 h-100" />
                  </div>
                  <Card.Body className="d-lg-none p-0 py-1 placeholder-glow">
                    <div className="placeholder rounded w-75" style={{ height: 14 }} />
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            books.map((book) => {
              return <BookCard key={book.id} book={book.info} />;
            })
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default HomePageSection;
