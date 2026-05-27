import { useEffect, useState } from "react";
import { instance } from "../../config/api";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChevronRight } from "react-bootstrap-icons";
import BookCard from "../BookCard/BookCard";

//gestire loading e errore
const HomePageSection = ({ filter, title, loading, setLoading }) => {
  const [books, setBooks] = useState([]);

  const getSectionBooks = () => {
    instance
      .get("/me/books?size=6&order=title&status=" + filter)
      .then((response) => {
        setBooks(response.data.content);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getSectionBooks();
  }, []);

  return (
    <Row className="g-2 mb-lg-4">
      <Col xs={12}>
        <div className="d-flex align-items-center justify-content-between">
          <h2>{title}</h2>
          <Link to={`/library?status=${filter}`} className="text-muted text-decoration-none d-flex align-items-center gap-1">
            View more
            <span>
              <ChevronRight size={18}></ChevronRight>
            </span>
          </Link>
        </div>
      </Col>

      <Col className="overflow-auto hide-scrollbar">
        <Row className="flex-nowrap pe-5 pe-lg-0 g-3 pt-1">
          {loading &&
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
            ))}
          {!loading &&
            books.map((book) => {
              return <BookCard key={book.id} book={book.info} />;
            })}
          {}
        </Row>
      </Col>
    </Row>
  );
};

export default HomePageSection;
