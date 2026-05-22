import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import { Container, Row, Col, ListGroup, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import BookCard from "../BookCard/BookCard";
import { Search, ThreeDots } from "react-bootstrap-icons";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleBooksCount, setVisibleBooksCount] = useState(10);
  const visibleBooks = books.slice(0, visibleBooksCount);
  const hasNext = visibleBooksCount < books.length;

  const searchBooks = (query, filter) => {
    instance
      .get(`/books/search?&${filter}=${query}`)
      .then((response) => {
        console.log(response);
        setVisibleBooksCount(10);
        setBooks(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = (query, filter) => {
    if (!query.trim()) {
      setBooks([]);
      setVisibleBooksCount(10);
      return;
    } else {
      searchBooks(query, filter);
    }
  };

  const loadNextPage = () => {
    setVisibleBooksCount((prev) => prev + 10);
  };

  useEffect(() => {
    if (!query.trim()) return;
    searchBooks(query, filter);
  }, [filter]);

  return (
    <Container fluid className="py-4 d-flex flex-column gap-4">
      <Row>
        <Col>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query, filter);
            }}
          >
            <InputGroup>
              <Form.Control className="rounded-start-pill" type="search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button type="submit" className="rounded-end-pill bg-dark">
                <Search className="mb-1"></Search>
              </Button>
            </InputGroup>
          </Form>
          <ToggleButtonGroup
            type="radio"
            name="filters"
            value={filter}
            onChange={(value) => {
              if (!query.trim()) {
                setBooks([]);
                setVisibleBooksCount(10);
                setFilter(value);
              } else {
                setFilter(value);
              }
            }}
          >
            <ToggleButton id="tbg-btn-1" value={"title"}>
              Title
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" value={"author"}>
              Author
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" value={"category"}>
              Category
            </ToggleButton>
            <ToggleButton id="tbg-btn-4" value={"publisher"}>
              Publisher
            </ToggleButton>
          </ToggleButtonGroup>
          {/*  <Button active={readingStatus === "TO_READ"} onClick={() => handleStatusToggle("TO_READ")}>
            To read
          </Button>
          <Button active={readingStatus === "READING"} onClick={() => handleStatusToggle("READING")}>
            Reading
          </Button>
          <Button active={readingStatus === "READ"} onClick={() => handleStatusToggle("READ")}>
            Read
          </Button> */}
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12}>
          <ListGroup>
            {!loading &&
              visibleBooks.map((book) => {
                return <BookCard key={book.googleId} book={book}></BookCard>;
              })}
          </ListGroup>
        </Col>
        {hasNext && (
          <Col xs={12} className="text-center">
            <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={() => loadNextPage()}></ThreeDots>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SearchPage;
