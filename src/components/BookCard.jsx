import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Badge } from "react-bootstrap";
import { Globe, LockFill } from "react-bootstrap-icons";
import { BookCheck, BookOpen, Book } from "lucide-react";
import BookSaveComponent from "./BookSaveComponent";

const BookCard = ({ book, status, isPublic, navigationState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultCover = "https://neelkanthpublishers.com/assets/bookcover_cover.png";
  return (
    <>
      {/*Homepage book card*/}
      {location.pathname === "/" && (
        <Col xs={5} sm={4} md={3} lg={2}>
          <div className="bv-book-card" onClick={() => navigate("/books/" + book.googleId)}>
            <div className="bv-book-card__cover-wrap rounded-2">
              <img className="bv-book-card__cover rounded-2" src={book.coverURL ? book.coverURL : defaultCover} alt={book.title} />
              <div className="bv-book-card__overlay rounded-2">
                <span className="bv-book-card__title-overlay">{book.title}</span>
                <span className="bv-book-card__author-overlay">{book.authors?.[0] || "Unknown author"}</span>
              </div>
            </div>
            <div className="bv-book-card__body d-lg-none">
              <p className="bv-book-card__title mb-0">{book.title}</p>
              <p className="bv-book-card__author mb-0">{book.authors?.[0] || "Unknown author"}</p>
            </div>
          </div>
        </Col>
      )}

      {/* Profile page book card */}
      {location.pathname === "/me" && (
        <Col className="mb-3">
          <div className="bv-book-card" onClick={() => navigate("/books/" + book.googleId)}>
            <div className="bv-book-card__cover-wrap rounded-2">
              <img className="bv-book-card__cover rounded-2" src={book.coverURL ? book.coverURL : defaultCover} alt={book.title} />
              <div className="bv-book-card__overlay rounded-2">
                <span className="bv-book-card__title-overlay">{book.title}</span>
                <span className="bv-book-card__author-overlay">{book.authors?.[0] || "Unknown author"}</span>
              </div>
            </div>
          </div>
        </Col>
      )}

      {/* Library/search page books list item */}
      {(location.pathname === "/library" || location.pathname === "/search") && (
        <ListGroup.Item
          action
          className="bv-library-item border-0 position-relative px-0 px-sm-2 px-lg-3"
          onClick={() => navigate(`/books/${book.googleId}`, { state: navigationState })}
        >
          {location.pathname === "/library" && (
            <div className="d-flex gap-2 position-absolute top-0 end-0 mt-3 me-0 me-sm-2 me-lg-3">
              <Badge
                className="rounded-pill d-inline-flex align-items-center justify-content-center px-2 gap-1"
                bg={status === "READ" ? "read" : status === "READING" ? "reading" : status === "TO_READ" ? "toread" : "secondary"}
              >
                {status === "READ" && <BookCheck size={14} />}
                {status === "READING" && <BookOpen size={14} />}
                {status === "TO_READ" && <Book size={14} />}
              </Badge>
              <Badge className="rounded-pill d-inline-flex align-items-center justify-content-center px-2" bg={isPublic ? "reading" : "secondary"}>
                {isPublic ? <Globe size={14} /> : <LockFill size={14} />}
              </Badge>
            </div>
          )}

          <Row className="g-3 align-items-stretch">
            <Col xs={4} sm={3} md={2} xxl={1}>
              <div className="bv-library-item__cover-wrap rounded-2">
                <img className="bv-library-item__cover img-fluid rounded-2" src={book.coverURL ? book.coverURL : defaultCover} alt={book.title} />
              </div>
            </Col>
            {location.pathname === "/library" && (
              <Col xs={8} sm={9} md={10} xxl={11}>
                <Row className="h-100">
                  <Col xs={8} sm={9} md={10}>
                    <p className="bv-library-item__title my-2">{book.title}</p>
                  </Col>
                  <Col xs={11} className="flex-grow-1">
                    <div className="d-flex flex-column justify-content-center">
                      <p className="bv-library-item__author mb-0">{book.authors.length > 0 ? book.authors.join(", ") : "Unknown author"}</p>
                      <p className="bv-library-item__publisher mb-0">{book.publisher ? book.publisher : "Unknown publisher"}</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            )}

            {location.pathname === "/search" && (
              <>
                <Col xs={7} sm={8} md={9} xxl={10}>
                  <Row className="h-100">
                    <Col xs={12}>
                      <p className="bv-library-item__title my-2">{book.title}</p>
                    </Col>
                    <Col xs={12} className="flex-grow-1">
                      <div className="d-flex flex-column justify-content-center">
                        <p className="bv-library-item__author mb-0">{book.authors.length > 0 ? book.authors.join(", ") : "Unknown author"}</p>
                        <p className="bv-library-item__publisher mb-0">{book.publisher ? book.publisher : "Unknown publisher"}</p>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={1}>
                  <div className="d-flex flex-column h-100 justify-content-center align-items-end">
                    <BookSaveComponent book={book} />
                  </div>
                </Col>
              </>
            )}
          </Row>
        </ListGroup.Item>
      )}
    </>
  );
};

export default BookCard;
