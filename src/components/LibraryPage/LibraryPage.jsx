import { useState, useEffect, useRef } from "react";
import { instance } from "../../config/api";
import { Container, Row, Col, ListGroup, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import BookCard from "../BookCard/BookCard";
import { Search, ThreeDots } from "react-bootstrap-icons";
import { useSearchParams } from "react-router-dom";

const LibraryPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [readingStatus, setReadingStatus] = useState(searchParams.get("status") || null);
  const firstRender = useRef(true);

  const getAllBooks = (pageNumber, append) => {
    const readingStatusParam = readingStatus ? `&status=${readingStatus}` : "";
    instance
      .get(`/me/books?page=${pageNumber}&size=10${readingStatusParam}`)
      .then((response) => {
        console.log(response);
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
      })
      .finally(() => setLoading(false));
  };

  const searchBooks = (query, filter, pageNumber, append) => {
    const readingStatusParam = readingStatus ? `&status=${readingStatus}` : "";
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
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = (query, filter, pageNumber, append) => {
    if (!query.trim()) {
      getAllBooks(pageNumber, append);
    } else {
      searchBooks(query, filter, pageNumber, append);
    }
  };

  const loadNextPage = () => {
    const nextPage = currentPage + 1;
    handleSearch(query, filter, nextPage, true);
  };

  const handleStatusToggle = (value) => {
    setReadingStatus((prev) => (prev === value ? null : value));
  };

  useEffect(() => {
    getAllBooks(0, false);
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    searchBooks(query, filter, 0, false);
  }, [filter]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    handleSearch(query, filter, 0, false);
  }, [readingStatus]);

  return (
    <Container fluid className="py-4 p-3 px-lg-4 px-xl-5 container-lg d-flex flex-column gap-3 gap-sm-2 gap-lg-3">
      {/* <Row>
        <Col>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(0);
              handleSearch(query, filter, 0, false);
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
              setCurrentPage(0);
              setFilter(value);
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
          <ToggleButtonGroup type="radio" name="readingStatus" value={readingStatus || ""}>
            <ToggleButton id="tbg-btn-6" value={"TO_READ"} onClick={() => handleStatusToggle("TO_READ")}>
              To read
            </ToggleButton>
            <ToggleButton id="tbg-btn-7" value={"READING"} onClick={() => handleStatusToggle("READING")}>
              Reading
            </ToggleButton>
            <ToggleButton id="tbg-btn-8" value={"READ"} onClick={() => handleStatusToggle("READ")}>
              Read
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row> */}
      <Row className="justify-content-center">
        <Col xs={12}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(0);
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
              setCurrentPage(0);
              setFilter(value);
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
        <Col xs={8} xs={6} lg={4} className="d-flex justify-content-center">
          <ToggleButtonGroup type="radio" name="readingStatus" value={readingStatus || ""} className="flex-wrap gap-2 justify-content-center w-100">
            <ToggleButton
              id="tbg-btn-6"
              value="TO_READ"
              variant={readingStatus === "TO_READ" ? "warning" : "secondary"}
              onClick={() => handleStatusToggle("TO_READ")}
              className="rounded-pill text-white"
            >
              To read
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-7"
              value="READING"
              variant={readingStatus === "READING" ? "info" : "secondary"}
              onClick={() => handleStatusToggle("READING")}
              className="rounded-pill text-white"
            >
              Reading
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-8"
              value="READ"
              variant={readingStatus === "READ" ? "success" : "secondary"}
              onClick={() => handleStatusToggle("READ")}
              className="rounded-pill text-white"
            >
              Read
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12}>
          <ListGroup variant="flush" className="rounded-3">
            {!loading &&
              books.map((book) => {
                return <BookCard key={book.id} book={book.info} status={book.status} isPublic={book.public}></BookCard>;
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

export default LibraryPage;
