/* import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import { Container, Row, Col, ListGroup, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton, Spinner, Alert } from "react-bootstrap";
import BookCard from "../BookCard/BookCard";
import { Search, ThreeDots, ArrowClockwise } from "react-bootstrap-icons";
import { useNavigate, useSearchParams } from "react-router-dom";

const LibraryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [readingStatus, setReadingStatus] = useState(searchParams.get("status") || null);

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
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => setLoading(false));
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
        console.log(err);
        setError(true);
      })
      .finally(() => setLoading(false));
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
    handleSearch(query, filter, currentPage + 1, true);
  };

  const handleStatusToggle = (value) => {
    const newStatus = readingStatus === value ? null : value;
    setReadingStatus(newStatus);
    handleSearch(query, filter, 0, false, newStatus);
  };

  useEffect(() => {
    getAllBooks(0, false);
  }, []);

  return (
    <Container fluid className="py-4 p-3 px-lg-4 container-lg d-flex flex-column gap-2 gap-lg-3">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query, filter, 0, false);
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
                <Search className="mb-1" />
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
              handleSearch(query, value, 0, false);
            }}
            className="flex-wrap gap-2 justify-content-center w-100"
          >
            <ToggleButton id="tbg-btn-1" value="title" variant={filter === "title" ? "light" : "secondary"} className="rounded-pill">
              Title
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" value="author" variant={filter === "author" ? "light" : "secondary"} className="rounded-pill">
              Author
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" value="category" variant={filter === "category" ? "light" : "secondary"} className="rounded-pill">
              Category
            </ToggleButton>
            <ToggleButton id="tbg-btn-4" value="publisher" variant={filter === "publisher" ? "light" : "secondary"} className="rounded-pill">
              Publisher
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={6} lg={4} className="d-flex justify-content-center">
          <ToggleButtonGroup type="radio" name="readingStatus" value={readingStatus || ""} className="flex-wrap gap-2 justify-content-center w-100">
            <ToggleButton
              id="tbg-btn-6"
              value="TO_READ"
              variant={readingStatus === "TO_READ" ? "warning" : "secondary"}
              onClick={() => handleStatusToggle("TO_READ")}
              className="rounded-pill text-white px-1 px-sm-2"
            >
              To read
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-7"
              value="READING"
              variant={readingStatus === "READING" ? "info" : "secondary"}
              onClick={() => handleStatusToggle("READING")}
              className="rounded-pill text-white px-1 px-sm-2"
            >
              Reading
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-8"
              value="READ"
              variant={readingStatus === "READ" ? "success" : "secondary"}
              onClick={() => handleStatusToggle("READ")}
              className="rounded-pill text-white px-1 px-sm-2"
            >
              Read
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="g-3 pt-3 pt-sm-1 pt-md-2 pt-lg-0">
        <Col xs={12}>
          {loading ? (
            <div className="d-flex gap-3 justify-content-center align-items-center py-5">
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
                      handleSearch(query, filter, 0, false);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Alert>
            </div>
          ) : books.length === 0 ? (
            <div className="d-flex align-items-center justify-content-center gap-3 py-5">
              <Alert
                variant="secondary"
                className="d-flex flex-column align-items-center justify-content-between mb-0 rounded-3 gap-3 py-4 bg-transparent border-0"
              >
                <span className="text-center">
                  Looks like there are no books matching in your library. <br />
                  Try changing your search filters or explore the Search page to discover something new!
                </span>
                <div className="d-flex flex-column align-items-center gap-2">
                  <span className="fw-bold">Go to Search page</span>
                  <Search
                    size={30}
                    onClick={() => {
                      navigate("/search");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Alert>
            </div>
          ) : (
            <>
              <ListGroup variant="flush" className="rounded-3">
                {books.map((book) => (
                  <BookCard key={book.id} book={book.info} status={book.status} isPublic={book.public} />
                ))}
              </ListGroup>
              {hasNext && (
                <div className="text-center pt-2 pt-sm-3">
                  <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={() => loadNextPage()} />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LibraryPage; */

import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import { Container, Row, Col, ListGroup, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton, Spinner, Alert } from "react-bootstrap";
import BookCard from "../BookCard/BookCard";
import { Search, ThreeDots, ArrowClockwise, Book } from "react-bootstrap-icons";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";

const LibraryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const savedState = location.state;

  console.log("location.state", location.state);
  console.log("savedState", savedState);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const [query, setQuery] = useState(savedState?.query || "");
  const [filter, setFilter] = useState(savedState?.filter || "title");
  const [books, setBooks] = useState(savedState?.books || []);
  const [loading, setLoading] = useState(!savedState);
  const [currentPage, setCurrentPage] = useState(savedState?.currentPage || 0);
  const [hasNext, setHasNext] = useState(savedState?.hasNext || false);
  const [readingStatus, setReadingStatus] = useState(savedState?.readingStatus ?? searchParams.get("status") ?? null);

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
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        setError(true);
      })
      .finally(() => setLoading(false));
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
        console.log(err);
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        setError(true);
      })
      .finally(() => setLoading(false));
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
    handleSearch(query, filter, currentPage + 1, true);
  };

  const handleStatusToggle = (value) => {
    const newStatus = readingStatus === value ? null : value;
    setReadingStatus(newStatus);
    handleSearch(query, filter, 0, false, newStatus);
  };

  useEffect(() => {
    if (!savedState) {
      getAllBooks(0, false);
    }
  }, []);

  return (
    <Container fluid className="py-4 p-3 px-lg-4 container-lg d-flex flex-column gap-2 gap-lg-3">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query, filter, 0, false);
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
                <Search className="mb-1" />
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
              handleSearch(query, value, 0, false);
            }}
            className="flex-wrap gap-2 justify-content-center w-100"
          >
            <ToggleButton id="tbg-btn-1" value="title" variant={filter === "title" ? "light" : "secondary"} className="rounded-pill">
              Title
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" value="author" variant={filter === "author" ? "light" : "secondary"} className="rounded-pill">
              Author
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" value="category" variant={filter === "category" ? "light" : "secondary"} className="rounded-pill">
              Category
            </ToggleButton>
            <ToggleButton id="tbg-btn-4" value="publisher" variant={filter === "publisher" ? "light" : "secondary"} className="rounded-pill">
              Publisher
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={6} lg={4} className="d-flex justify-content-center">
          <ToggleButtonGroup type="radio" name="readingStatus" value={readingStatus || ""} className="flex-wrap gap-2 justify-content-center w-100">
            <ToggleButton
              id="tbg-btn-6"
              value="TO_READ"
              variant={readingStatus === "TO_READ" ? "warning" : "secondary"}
              onClick={() => handleStatusToggle("TO_READ")}
              className="rounded-pill text-white px-1 px-sm-2"
            >
              To read
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-7"
              value="READING"
              variant={readingStatus === "READING" ? "info" : "secondary"}
              onClick={() => handleStatusToggle("READING")}
              className="rounded-pill text-white px-1 px-sm-2"
            >
              Reading
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-8"
              value="READ"
              variant={readingStatus === "READ" ? "success" : "secondary"}
              onClick={() => handleStatusToggle("READ")}
              className="rounded-pill text-white px-1 px-sm-2"
            >
              Read
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="g-3 pt-3 pt-sm-1 pt-md-2 pt-lg-0">
        <Col xs={12}>
          {loading ? (
            <div className="d-flex gap-3 justify-content-center align-items-center py-5">
              <Spinner animation="grow" />
              <Spinner animation="grow" />
              <Spinner animation="grow" />
            </div>
          ) : error ? (
            <div className="d-flex align-items-center justify-content-center gap-3 py-5 my-5">
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
                      handleSearch(query, filter, 0, false);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Alert>
            </div>
          ) : books.length === 0 ? (
            <>
              {query || readingStatus ? (
                <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5 text-muted">
                  <h5 className="mb-0">No books matching your research</h5>
                  <p className="mb-0 small">Try changing your search filters or explore the Search Page to discover something new</p>
                  <Link to="/search" className="fw-bold text-light opacity-75 text-decoration-none">
                    Go to Search page
                  </Link>
                  <Search
                    className="text-light opacity-75"
                    size={40}
                    onClick={() => {
                      navigate("/search");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5 text-muted">
                  <h5 className="mb-0">Looks like your library is empty!</h5>
                  <p className="mb-0 small">Discover new books and start building your collection</p>
                  <Link to="/search" className="fw-bold text-light opacity-75 text-decoration-none">
                    Go to Search page
                  </Link>
                  <Search
                    className="text-light opacity-75"
                    size={40}
                    onClick={() => {
                      navigate("/search");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <ListGroup variant="flush" className="rounded-3">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book.info}
                    status={book.status}
                    isPublic={book.public}
                    navigationState={{ query, filter, books, currentPage, hasNext, readingStatus, from: "/library" }}
                  />
                ))}
              </ListGroup>
              {hasNext && (
                <div className="text-center pt-2 pt-sm-3">
                  <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={() => loadNextPage()} />
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
