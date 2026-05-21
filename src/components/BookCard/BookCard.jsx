import { useLocation, useNavigate } from "react-router-dom";
import "./BookCard.css";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

const BookCard = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && (
        <Col xs={6} sm={5} md={3} xl={2}>
          <Card className="bg-dark text-white border-0 book-card">
            <Card.Img
              className="book-cover"
              src={props.book.info.coverURL}
              alt={props.book.info.title}
              onClick={() => navigate("/books/" + props.book.info.googleId)}
            />
            <Card.ImgOverlay className="d-none d-lg-flex align-items-end py-0 px-2 overlay">
              <Card.Title className="fs-6">{props.book.info.title}</Card.Title>
            </Card.ImgOverlay>
            <Card.Body className="d-lg-none p-1">
              <Card.Text className="book-title">{props.book.info.title}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      )}

      {location.pathname === "/library" && (
        <ListGroup.Item className="border-0" onClick={() => navigate(`/books/${props.book.info.googleId}`)} style={{ cursor: "pointer" }}>
          <Row className=" align-items-center">
            <Col xs={3}>
              <img className="book-cover img-fluid" src={props.book.info.coverURL} alt={props.book.info.title} />
            </Col>
            <Col>
              <h6>{props.book.info.title}</h6>
              <p className="small mb-1">{props.book.info.authors.length > 0 ? props.book.info.authors.join(", ") : "Unknown author"}</p>
              <p className="small mb-1 fst-italic">{props.book.info.publisher ? props.book.info.publisher : "Unknown publisher"}</p>
            </Col>
            <Col xs={1}>
              <ChevronRight size={25}></ChevronRight>
              {/* <SuitHeartFill
                size={25}
                onClick={(e) => {
                  e.stopPropagation();
                  removeBook();
                }}
              /> */}
              {/* <BookSaveComponent book={props.book.info} /> */}
            </Col>
          </Row>
        </ListGroup.Item>
      )}
    </>
  );
};

export default BookCard;
