import "./HomePageSection.css";
import { Row, Col } from "react-bootstrap";
import { instance } from "../../config/api";
import { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard";

//gestire loading e errore
const HomePageSection = (props) => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);

  const getSectionBooks = () => {
    instance
      .get("/me/books?status=" + props.filter)
      .then((response) => {
        setBooks(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSectionBooks();
  }, []);

  return (
    <Row className="g-2">
      <Col xs={12}>
        <h2>{props.title}</h2>
      </Col>
      <Col className="overflow-auto hide-scrollbar">
        <Row className="flex-nowrap pe-5 pe-lg-0 g-3">
          {books.map((book) => {
            return <BookCard key={book.id} book={book} />;
          })}
        </Row>
      </Col>
    </Row>
  );
};

export default HomePageSection;
