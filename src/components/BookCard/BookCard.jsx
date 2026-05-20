import { useNavigate } from "react-router-dom";
import "./BookCard.css";
import { Col, Card } from "react-bootstrap";
const BookCard = (props) => {
  const navigate = useNavigate();
  return (
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
  );
};

export default BookCard;
