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
    <Container fluid className="py-4 d-flex flex-column gap-4">
      <Row>
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
          <ToggleButtonGroup
            type="radio"
            name="readingStatus"
            value={readingStatus || ""}
            /* onChange={(value) => {
              setCurrentPage(0);
              setReadingStatus(value.length ? value[0] : null);
            }} */
          >
            {/* <ToggleButton id="tbg-btn-5" value={"ALL"}>
              All
            </ToggleButton> */}
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
              books.map((book) => {
                return <BookCard key={book.id} book={book.info}></BookCard>;
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
