import { useState, useEffect } from "react";
import { instance } from "../config/api";
import { Container, Row, Col, ListGroup, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton, Spinner } from "react-bootstrap";
import BookCard from "./BookCard";
import { Search, ThreeDots, ArrowClockwise } from "react-bootstrap-icons";
import { useLocation, useSearchParams, Link } from "react-router-dom";

const LibraryPage = () => {
  const location = useLocation();
  const savedState = location.state;
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const [query, setQuery] = useState(savedState?.query || "");
  const [filter, setFilter] = useState(savedState?.filter || "title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [readingStatus, setReadingStatus] = useState(savedState?.readingStatus ?? searchParams.get("status") ?? null);
  const [hasBooks, setHasBooks] = useState(savedState?.hasBooks ?? null);
  const [loadingMore, setLoadingMore] = useState(false);

  const getAllBooks = (pageNumber, append, status = readingStatus) => {
    const readingStatusParam = status ? `&status=${status}` : "";
    instance
      .get(`/me/books?page=${pageNumber}&size=10${readingStatusParam}`)
      .then((response) => {
        if (append) {
          setBooks((prev) => [...prev, ...response.data.content]);
        } else {
          setBooks(response.data.content);
        }
        if (!status && pageNumber === 0) {
          setHasBooks(response.data.content.length > 0 || response.data.totalElements > 0);
        }
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
      })
      .catch((err) => {
        if (err.handled) return;
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        if (append) setLoadingMore(false);
      });
  };

  const searchBooks = (query, filter, pageNumber, append, status = readingStatus) => {
    const readingStatusParam = status ? `&status=${status}` : "";
    instance
      .get(`/me/books?page=${pageNumber}&size=10&${filter}=${query}${readingStatusParam}`)
      .then((response) => {
        if (append) {
          setBooks((prev) => [...prev, ...response.data.content]);
        } else {
          setBooks(response.data.content);
        }
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
      })
      .catch((err) => {
        if (err.handled) return;
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        if (append) setLoadingMore(false);
      });
  };

  const handleSearch = (query, filter, pageNumber, append, status = readingStatus) => {
    if (!query.trim()) {
      if (!append) {
        setBooks([]);
        setLoading(true);
      }
      getAllBooks(pageNumber, append, status);
    } else {
      if (!append) {
        setBooks([]);
        setLoading(true);
      }
      searchBooks(query, filter, pageNumber, append, status);
    }
  };

  const loadNextPage = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    handleSearch(query, filter, currentPage + 1, true);
  };

  const handleStatusToggle = (value) => {
    const newStatus = readingStatus === value ? null : value;
    setReadingStatus(newStatus);
    handleSearch(query, filter, 0, false, newStatus);
  };

  useEffect(() => {
    const query = savedState?.query || "";
    const filter = savedState?.filter || "title";
    const status = savedState?.readingStatus ?? searchParams.get("status") ?? null;
    if (!query.trim()) {
      getAllBooks(0, false, status);
    } else {
      searchBooks(query, filter, 0, false, status);
    }
  }, []);

  return (
    <Container fluid className="py-4 p-3 px-lg-4 container-lg d-flex flex-column gap-2 gap-lg-3 min-vh-100">
      {/* Search bar */}
      <Row className="justify-content-center">
        <Col xs={12}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query, filter, 0, false);
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
              <Button
                type="submit"
                disabled={loading}
                className="rounded-end-pill bg-dark border-secondary border-opacity-25 d-flex align-items-center justify-content-center"
              >
                {loading ? <Spinner animation="border" size="sm" className="text-accent mb-1 mt-2 me-1" /> : <Search size={20} className="text-accent my-1" />}
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
              handleSearch(query, value, 0, false);
            }}
            className="flex-wrap gap-2 justify-content-center w-100"
          >
            <ToggleButton id="tbg-btn-1" disabled={loading} value="title" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Title
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" disabled={loading} value="author" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Author
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" disabled={loading} value="category" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Category
            </ToggleButton>
            <ToggleButton id="tbg-btn-4" disabled={loading} value="publisher" variant="outline-secondary" className="rounded-pill bv-filter-btn">
              Publisher
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={9} sm={6} lg={5} className="d-flex justify-content-center">
          <ToggleButtonGroup type="radio" name="readingStatus" value={readingStatus || ""} className="flex-wrap gap-2 justify-content-center w-100">
            <ToggleButton
              id="tbg-btn-6"
              disabled={loading}
              value="TO_READ"
              variant="outline-secondary"
              onClick={() => handleStatusToggle("TO_READ")}
              className="rounded-pill bv-status-btn bv-status-btn--toread"
            >
              To read
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-7"
              disabled={loading}
              value="READING"
              variant="outline-secondary"
              onClick={() => handleStatusToggle("READING")}
              className="rounded-pill bv-status-btn bv-status-btn--reading"
            >
              Reading
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-8"
              disabled={loading}
              value="READ"
              variant="outline-secondary"
              onClick={() => handleStatusToggle("READ")}
              className="rounded-pill bv-status-btn bv-status-btn--read"
            >
              Read
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      {/* Bookslist */}
      <Row className="g-3 pt-3 pt-sm-1 pt-md-2 pt-lg-0">
        <Col xs={12}>
          {loading ? (
            <div className="d-flex gap-3 justify-content-center align-items-center py-5 my-5">
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
                  handleSearch(query, filter, 0, false);
                }}
              />
              <h5 className="bv-empty-state__title">Something went wrong</h5>
              <p className="bv-empty-state__text">Something went wrong loading the results.</p>
              <span
                className="bv-empty-state__link cursor-pointer"
                onClick={() => {
                  setError(false);
                  handleSearch(query, filter, 0, false);
                }}
              >
                Try again
              </span>
            </div>
          ) : books.length === 0 ? (
            <>
              {query || readingStatus || hasBooks ? (
                <div className="bv-empty-state">
                  <Search size={40} className="bv-empty-state__icon" />
                  <h5 className="bv-empty-state__title">No books matching your research</h5>
                  <p className="bv-empty-state__text">Try changing your search filters or explore the Search Page to discover something new</p>
                  <Link to="/search" className="bv-empty-state__link">
                    Go to Search page
                  </Link>
                </div>
              ) : (
                <div className="bv-empty-state">
                  <Search size={40} className="bv-empty-state__icon" />
                  <h5 className="bv-empty-state__title">Looks like your library is empty!</h5>
                  <p className="bv-empty-state__text">Discover new books and start building your collection</p>
                  <Link to="/search" className="bv-empty-state__link">
                    Go to Search page
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <ListGroup variant="flush" className="rounded-3 mt-2">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book.info}
                    status={book.status}
                    isPublic={book.public}
                    navigationState={{ query, filter, readingStatus, hasBooks, from: "/library" }}
                  />
                ))}
              </ListGroup>
              {hasNext && (
                <div className="text-center pt-2 pt-sm-3">
                  {loadingMore ? (
                    <div className="d-inline-flex gap-2 align-items-center justify-content-center" style={{ height: 50 }}>
                      <span className="bv-loader-dot" />
                      <span className="bv-loader-dot" />
                      <span className="bv-loader-dot" />
                    </div>
                  ) : (
                    <ThreeDots size={50} className="cursor-pointer text-faint" onClick={loadNextPage} />
                  )}
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LibraryPage;
