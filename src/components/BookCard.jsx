import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import { Book, BookFill, BookHalf, Globe, LockFill } from "react-bootstrap-icons";
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

      {/* Profile page book card */}
      {location.pathname === "/me" && (
        <Col className="mb-3">
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

      {/* Library/search page books list item */}
      {(location.pathname === "/library" || location.pathname === "/search") && (
        <ListGroup.Item
          action
          className=" bg-transparent px-1 py-2 py-sm-2 border-0 position-relative"
          onClick={() => {
            console.log("navigationState", navigationState);
            navigate(`/books/${book.googleId}`, { state: navigationState });
          }}
          style={{ cursor: "pointer" }}
        >
          {location.pathname === "/library" && (
            <div className="d-flex gap-2 position-absolute top-0 end-0 mt-3">
              <Badge
                className="rounded-pill d-inline-flex align-items-center justify-content-center px-3"
                bg={status === "READ" ? "success" : status === "READING" ? "info" : status === "TO_READ" ? "warning" : "secondary"}
              >
                {status === "READ" && <BookFill size={20} />}
                {status === "READING" && <BookHalf size={20} />}
                {status === "TO_READ" && <Book size={20} />}
              </Badge>

              <Badge className="rounded-pill d-inline-flex align-items-center justify-content-center px-0" bg="transparent">
                {isPublic ? <Globe size={20} /> : <LockFill size={20} />}
              </Badge>
            </div>
          )}
          <Row className="g-3">
            <Col xs={4} sm={3} md={2} xxl={1}>
              <img className="book-cover rounded-3 img-fluid" src={book.coverURL ? book.coverURL : defaultCover} alt={book.title} />
            </Col>
            <Col xs={5} sm={7} md={8} xxl={9}>
              <div className="d-flex flex-column h-100 pt-xxl-2">
                <p className="mb-0 h5 pt-1 pt-sm-2 text-light d-lg-none">{book.title}</p>
                <p className="mb-0 h4 pt-1 pt-sm-2 text-light d-none d-lg-block pt-xxl-0 ">{book.title}</p>
                <div className="flex-grow-1 d-flex flex-column justify-content-center gap-sm-1 gap-xl-2">
                  <p className="mb-0 small d-sm-none">{book.authors.length > 0 ? book.authors.join(", ") : "Unknown author"}</p>
                  <p className="mb-0 fst-italic small  d-sm-none">{book.publisher ? book.publisher : "Unknown publisher"}</p>
                  <p className="mb-0 d-none d-sm-block d-lg-none">{book.authors.length > 0 ? book.authors.join(", ") : "Unknown author"}</p>
                  <p className="mb-0 fst-italic d-none d-sm-block d-lg-none">{book.publisher ? book.publisher : "Unknown publisher"}</p>
                  <p className="mb-0 d-none d-lg-block fs-5">{book.authors.length > 0 ? book.authors.join(", ") : "Unknown author"}</p>
                  <p className="mb-0 fst-italic d-none d-lg-block fs-5">{book.publisher ? book.publisher : "Unknown publisher"}</p>
                </div>
              </div>
            </Col>
            {location.pathname === "/search" && (
              <Col xs={1} className=" offset-2 offset-sm-1">
                <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                  <BookSaveComponent book={book} />
                </div>
              </Col>
            )}
          </Row>
        </ListGroup.Item>
      )}
    </>
  );
};

export default BookCard;
