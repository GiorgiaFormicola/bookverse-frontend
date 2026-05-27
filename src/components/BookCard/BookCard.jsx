import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";
import BookSaveComponent from "../BookSaveComponent/BookSaveComponent";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultCover = "https://neelkanthpublishers.com/assets/bookcover_cover.png";
  return (
    <>
      {/* HOMEPAGE BOOK CARD */}
      {location.pathname === "/" && (
        <Col xs={6} sm={5} md={3} lg={2}>
          <Card className="bg-transparent border-0 book-card ">
            <Card.Img
              className="book-cover rounded-3"
              src={book.coverURL ? book.coverURL : defaultCover}
              alt={book.title}
              onClick={() => navigate("/books/" + book.googleId)}
            />
            <Card.ImgOverlay className="d-none d-lg-flex align-items-end py-0 px-2 overlay rounded-3">
              <Card.Title className="fs-6">{book.title}</Card.Title>
            </Card.ImgOverlay>
            <Card.Body className="d-lg-none p-1">
              <Card.Text className="book-title">{book.title}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      )}
      {/* HOMEPAGE BOOK CARD */}

      {/* PROFILE PAGE BOOK CARD */}
      {location.pathname === "/me" && (
        <Col xs={4} sm={3} lg={2}>
          <Card className="bg-transparent border-0 book-card">
            <Card.Img
              className="book-cover rounded-3"
              src={book.coverURL ? book.coverURL : defaultCover}
              alt={book.title}
              onClick={() => navigate("/books/" + book.googleId)}
            />
            <Card.ImgOverlay className="d-none d-lg-flex align-items-end py-0 px-2 overlay rounded-3">
              <Card.Title className="fs-6">{book.title}</Card.Title>
            </Card.ImgOverlay>
          </Card>
        </Col>
      )}
      {/* PROFILE PAGE BOOK CARD */}

      {/* LIBRARY/SEARCH LIST BOOK ITEM */}
      {(location.pathname === "/library" || location.pathname === "/search") && (
        <ListGroup.Item className="border-0 position-relative" onClick={() => navigate(`/books/${book.googleId}`)} style={{ cursor: "pointer" }}>
          <Row className=" align-items-center">
            <Col xs={3}>
              <img className="book-cover img-fluid" src={book.coverURL ? book.coverURL : defaultCover} alt={book.title} />
            </Col>
            <Col>
              <h6>{book.title}</h6>
              <p className="small mb-1">{book.authors.length > 0 ? book.authors.join(", ") : "Unknown author"}</p>
              <p className="small mb-1 fst-italic">{book.publisher ? book.publisher : "Unknown publisher"}</p>
            </Col>
            <Col xs={1}>
              {location.pathname === "/library" && <ChevronRight size={25} />}
              {location.pathname === "/search" && <BookSaveComponent book={book} />}
            </Col>
          </Row>
        </ListGroup.Item>
      )}
      {/* LIBRARY/SEARCH LIST BOOK ITEM */}
    </>
  );
};

export default BookCard;
