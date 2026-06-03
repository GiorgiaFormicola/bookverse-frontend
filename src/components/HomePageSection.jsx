import { useEffect, useState } from "react";
import { instance } from "../config/api";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowClockwise } from "react-bootstrap-icons";
import { ChevronRight } from "lucide-react";
import BookCard from "./BookCard";

const HomePageSection = ({ filter, reviewed, title, loading, setLoading, onEmpty }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(false);

  const getSectionBooks = () => {
    instance
      .get("/me/books?size=6&order=title&status=" + filter + (reviewed === false ? "&reviewed=false" : ""))
      .then((response) => {
        setBooks(response.data.content);
        if (response.data.content.length === 0) onEmpty?.();
      })
      .catch((err) => {
        if (err.handled) return;
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
            <Link to={`/library?status=${filter}`} className="view-more-link text-decoration-none d-flex align-items-center gap-1 fw-semibold">
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
            <Col xs={12}>
              <div className="bv-empty-state">
                <ArrowClockwise
                  size={40}
                  className="bv-empty-state__icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                    getSectionBooks();
                  }}
                />
                <h5 className="bv-empty-state__title">Something went wrong</h5>
                <p className="bv-empty-state__text">Something went wrong loading this section.</p>
                <span
                  className="bv-empty-state__link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                    getSectionBooks();
                  }}
                >
                  Try again
                </span>
              </div>
            </Col>
          ) : loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Col key={i} xs={5} sm={4} md={3} lg={2}>
                <div className="bv-book-card__cover-wrap placeholder-glow">
                  <div className="placeholder w-100" style={{ aspectRatio: "3/4", borderRadius: "var(--bs-border-radius-lg)" }} />
                </div>
                <div className="d-lg-none mt-2 placeholder-glow">
                  <div className="placeholder rounded w-75" style={{ height: 12 }} />
                  <div className="placeholder rounded w-50 mt-1" style={{ height: 10 }} />
                </div>
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
