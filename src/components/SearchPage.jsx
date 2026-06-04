import { useLocation } from "react-router-dom";
import { useState } from "react";
import { instance } from "../config/api";
import { Container, Row, Col, ListGroup, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton, Spinner } from "react-bootstrap";
import BookCard from "./BookCard";
import { Search, ThreeDots, ArrowClockwise, Book } from "react-bootstrap-icons";

const SearchPage = () => {
  const location = useLocation();
  const savedState = location.state;
  const [query, setQuery] = useState(savedState?.query || "");
  const [filter, setFilter] = useState(savedState?.filter || "title");
  const [books, setBooks] = useState(savedState?.books || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [visibleBooksCount, setVisibleBooksCount] = useState(savedState?.visibleBooksCount || 10);
  const [hasSearched, setHasSearched] = useState(savedState?.hasSearched || false);

  const visibleBooks = books.slice(0, visibleBooksCount);
  const hasNext = visibleBooksCount < books.length;

  const searchBooks = (query, filter) => {
    setBooks([]);
    setLoading(true);
    instance
      .get(`/books/search?&${filter}=${query}`)
      .then((response) => {
        setVisibleBooksCount(10);
        setBooks(response.data);
      })
      .catch((err) => {
        if (err.handled) return;
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
    <Container fluid className="py-4 p-3 px-lg-4 container-lg d-flex flex-column gap-2 gap-lg-3 min-vh-100">
      {/* Search bar */}
      <Row className="justify-content-center">
        <Col xs={12}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query, filter);
            }}
          >
            <InputGroup className="mb-2">
              <Form.Control
                className="rounded-start-pill px-4"
                type="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-end-pill bg-dark border-secondary border-opacity-25">
                <Search size={20} className="text-accent my-1" />
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="justify-content-center">
        <Col xs={12} sm={9} lg={8} className="d-flex justify-content-center">
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
            <ToggleButton id="tbg-btn-1" value="title" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Title
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" value="author" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Author
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" value="category" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Category
            </ToggleButton>
            <ToggleButton id="tbg-btn-4" value="publisher" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Publisher
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      {/* Booklist */}
      <Row className="g-3 pt-3 pt-sm-1 pt-md-2 pt-lg-0">
        <Col xs={12}>
          {loading ? (
            <div className="d-flex gap-3 justify-content-center align-items-center py-5">
              <Spinner animation="grow" size="sm" style={{ color: "var(--primary-light)" }} />
              <Spinner animation="grow" size="sm" style={{ color: "var(--accent)" }} />
              <Spinner animation="grow" size="sm" style={{ color: "var(--st-review)" }} />
            </div>
          ) : error ? (
            <div className="bv-empty-state">
              <ArrowClockwise
                size={40}
                className="bv-empty-state__icon cursor-pointer"
                onClick={() => {
                  setError(false);
                  searchBooks(query, filter);
                }}
              />
              <h5 className="bv-empty-state__title">Something went wrong</h5>
              <p className="bv-empty-state__text">Something went wrong loading the results.</p>
              <span
                className="bv-empty-state__link cursor-pointer"
                onClick={() => {
                  setError(false);
                  searchBooks(query, filter);
                }}
              >
                Try again
              </span>
            </div>
          ) : !hasSearched ? (
            <div className="bv-empty-state">
              <Book size={40} className="bv-empty-state__icon" />
              <h5 className="bv-empty-state__title">Discover your next read</h5>
              <p className="bv-empty-state__text">Search for a book by title, author, category or publisher</p>
            </div>
          ) : books.length === 0 && hasSearched ? (
            <div className="bv-empty-state">
              <Search size={40} className="bv-empty-state__icon" />
              <h5 className="bv-empty-state__title">No results found</h5>
              <p className="bv-empty-state__text">Try searching with different keywords or filters</p>
            </div>
          ) : (
            <>
              <ListGroup variant="flush" className="rounded-3 mt-2">
                {visibleBooks.map((book) => (
                  <BookCard key={book.googleId} book={book} navigationState={{ query, filter, books, visibleBooksCount, hasSearched, from: "/search" }} />
                ))}
              </ListGroup>
              {hasNext && (
                <div className="text-center pt-2 pt-sm-3">
                  <ThreeDots size={50} className="cursor-pointer text-faint" onClick={() => loadNextPage()} />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
