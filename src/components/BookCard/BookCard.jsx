import { useLocation, useNavigate } from "react-router-dom";
import "./BookCard.css";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";
import BookSaveComponent from "../BookSaveComponent/BookSaveComponent";

const BookCard = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultCover = "https://neelkanthpublishers.com/assets/bookcover_cover.png";
  return (
    <>
      {location.pathname === "/" && (
        <Col xs={6} sm={5} md={3} xl={2}>
          <Card className="bg-dark text-white border-0 book-card">
            <Card.Img
              className="book-cover"
              src={props.book.coverURL ? props.book.coverURL : defaultCover}
              alt={props.book.title}
              onClick={() => navigate("/books/" + props.book.googleId)}
            />
            <Card.ImgOverlay className="d-none d-lg-flex align-items-end py-0 px-2 overlay">
              <Card.Title className="fs-6">{props.book.title}</Card.Title>
            </Card.ImgOverlay>
            <Card.Body className="d-lg-none p-1">
              <Card.Text className="book-title">{props.book.title}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      )}

      {(location.pathname === "/library" || location.pathname === "/search") && (
        <ListGroup.Item className="border-0 position-relative" onClick={() => navigate(`/books/${props.book.googleId}`)} style={{ cursor: "pointer" }}>
          <Row className=" align-items-center">
            <Col xs={3}>
              <img className="book-cover img-fluid" src={props.book.coverURL ? props.book.coverURL : defaultCover} alt={props.book.title} />
            </Col>
            <Col>
              <h6>{props.book.title}</h6>
              <p className="small mb-1">{props.book.authors.length > 0 ? props.book.authors.join(", ") : "Unknown author"}</p>
              <p className="small mb-1 fst-italic">{props.book.publisher ? props.book.publisher : "Unknown publisher"}</p>
            </Col>
            <Col xs={1}>
              {location.pathname === "/library" && <ChevronRight size={25} />}
              {location.pathname === "/search" && <BookSaveComponent book={props.book} />}

              {/* <SuitHeartFill
                size={25}
                onClick={(e) => {
                  e.stopPropagation();
                  removeBook();
                }}
              /> */}
            </Col>
          </Row>
        </ListGroup.Item>
      )}
    </>
  );
};

export default BookCard;
