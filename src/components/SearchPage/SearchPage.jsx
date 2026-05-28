import { useState } from "react";
import { instance } from "../../config/api";
import { Container, Row, Col, ListGroup, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton, Spinner, Alert } from "react-bootstrap";
import BookCard from "../BookCard/BookCard";
import { Search, ThreeDots, ArrowClockwise, BookHalf } from "react-bootstrap-icons";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [visibleBooksCount, setVisibleBooksCount] = useState(10);
  const [hasSearched, setHasSearched] = useState(false);

  const visibleBooks = books.slice(0, visibleBooksCount);
  const hasNext = visibleBooksCount < books.length;

  const searchBooks = (query, filter) => {
    setBooks([]);
    setLoading(true);
    instance
      .get(`/books/search?&${filter}=${query}`)
      .then((response) => {
        console.log(response);
        setVisibleBooksCount(10);
        setBooks(response.data);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = (query, filter) => {
    if (!query.trim()) {
      setBooks([]);
      setVisibleBooksCount(10);
      setHasSearched(false);
      return;
    } else {
      setHasSearched(true);
      searchBooks(query, filter);
    }
  };

  const loadNextPage = () => {
    setVisibleBooksCount((prev) => prev + 10);
  };

  return (
    <Container fluid className="py-4 p-3 px-lg-4 px-xl-5 container-lg d-flex flex-column gap-3 gap-sm-2 gap-lg-3 min-vh-100">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query, filter);
            }}
          >
            <InputGroup>
              <Form.Control
                className="rounded-start-pill border-secondary bg-dark text-light"
                type="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-end-pill bg-dark border-secondary">
                <Search className="mb-1"></Search>
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={9} lg={6} className="d-flex justify-content-center">
          <ToggleButtonGroup
            type="radio"
            name="filters"
            value={filter}
            onChange={(value) => {
              setFilter(value);
              if (query.trim()) {
                searchBooks(query, value);
              }
            }}
            className="flex-wrap gap-2 justify-content-center w-100"
          >
            <ToggleButton id="tbg-btn-1" value={"title"} variant={filter === "title" ? "light" : "secondary"} className="rounded-pill">
              Title
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" value={"author"} variant={filter === "author" ? "light" : "secondary"} className="rounded-pill">
              Author
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" value={"category"} variant={filter === "category" ? "light" : "secondary"} className="rounded-pill">
              Category
            </ToggleButton>
            <ToggleButton id="tbg-btn-4" value={"publisher"} variant={filter === "publisher" ? "light" : "secondary"} className="rounded-pill">
              Publisher
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="g-3 flex-grow-1">
        <Col xs={12}>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center gap-3 py-5 my-5">
              <Spinner animation="grow" />
              <Spinner animation="grow" />
              <Spinner animation="grow" />
            </div>
          ) : error ? (
            <div className="d-flex align-items-center justify-content-center gap-3 py-5">
              <Alert
                variant="secondary"
                className="d-flex flex-column align-items-center justify-content-between mb-0 rounded-3 gap-3 py-4 bg-transparent border-0"
              >
                <span>Something went wrong loading the results.</span>
                <div className="d-flex flex-column align-items-center gap-2">
                  <span className="fw-bold">Try again</span>
                  <ArrowClockwise
                    size={30}
                    onClick={() => {
                      setError(false);
                      searchBooks(query, filter);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Alert>
            </div>
          ) : !hasSearched ? (
            <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5 text-muted">
              <BookHalf size={50} />
              <h5 className="mb-0">Discover your next read</h5>
              <p className="mb-0 small">Search for a book by title, author, category or publisher</p>
            </div>
          ) : (
            <ListGroup variant="flush" className="rounded-3">
              {visibleBooks.map((book) => (
                <BookCard key={book.googleId} book={book} />
              ))}
            </ListGroup>
          )}
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
