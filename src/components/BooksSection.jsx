import { useState, useEffect, useRef } from "react";
import { Card, Badge, Table, Button, Pagination, Spinner } from "react-bootstrap";
import BooksFilters from "./BooksFilters";
import EditBookModal from "./EditBookModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { instance } from "../config/api";

const BooksSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const defaultCover = "https://neelkanthpublishers.com/assets/bookcover_cover.png";
  const tableRef = useRef(null);
  const shouldScrollRef = useRef(false);

  const [filters, setFilters] = useState({
    title: "",
    author: "",
    publisher: "",
    missingAuthor: false,
    missingPublisher: false,
    missingIsbn10: false,
    missingIsbn13: false,
    missingCategory: false,
    missingPublishedDate: false,
    missingDescription: false,
    missingPages: false,
    missingCoverURL: false,
  });

  const [queryFilters, setQueryFilters] = useState({
    title: "",
    author: "",
    publisher: "",
    missingAuthor: false,
    missingPublisher: false,
    missingIsbn10: false,
    missingIsbn13: false,
    missingCategory: false,
    missingPublishedDate: false,
    missingDescription: false,
    missingPages: false,
    missingCoverURL: false,
    page: 0,
    size: 20,
    sortBy: "title",
    order: "asc",
  });

  const getVisiblePages = () => {
    const maxVisible = 6;
    let start = Math.max(0, queryFilters.page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(0, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getBooks = (params) => {
    const searchParams = new URLSearchParams({
      ...(params.title && { title: params.title }),
      ...(params.author && { author: params.author }),
      ...(params.publisher && { publisher: params.publisher }),
      ...(params.missingAuthor && { missingAuthor: params.missingAuthor }),
      ...(params.missingPublisher && { missingPublisher: params.missingPublisher }),
      ...(params.missingIsbn10 && { missingIsbn10: params.missingIsbn10 }),
      ...(params.missingIsbn13 && { missingIsbn13: params.missingIsbn13 }),
      ...(params.missingCategory && { missingCategory: params.missingCategory }),
      ...(params.missingPublishedDate && { missingPublishedDate: params.missingPublishedDate }),
      ...(params.missingDescription && { missingDescription: params.missingDescription }),
      ...(params.missingPages && { missingPages: params.missingPages }),
      ...(params.missingCoverURL && { missingCoverURL: params.missingCoverURL }),
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || "title",
      order: params.order || "asc",
    });

    instance
      .get("/books?" + searchParams.toString())
      .then((response) => {
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
        setIsFirst(response.data.first);
        setIsLast(response.data.last);
      })
      .catch((err) => {
        if (err.handled) return;
        if (err.response?.status >= 500) {
          window.location.replace("/error?type=server");
          return;
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getBooks(queryFilters);
  }, [queryFilters]);

  useEffect(() => {
    if (!loading && shouldScrollRef.current) {
      shouldScrollRef.current = false;
      const top = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 70;
      window.scrollTo({ top, behavior: "auto" });
    }
  }, [loading]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (loading) return;
    setLoading(true);
    setQueryFilters((prev) => ({
      ...prev,
      ...filters,
      page: 0,
    }));
  };

  const handlePageChange = (page) => {
    if (loading) return;
    if (page === queryFilters.page) return;
    setLoading(true);
    shouldScrollRef.current = true;
    const top = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
    setQueryFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSaveBook = () => {
    setLoading(true);
    getBooks(queryFilters);
    setShowModal(false);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
  };

  const handleDeleteBook = () => {
    return instance
      .delete("/books/" + bookToDelete.googleId)
      .then(() => {
        setLoading(true);
        getBooks(queryFilters);
        setBookToDelete(null);
      })
      .catch((err) => {
        if (err.handled) return;
        if (err.response?.status >= 500) {
          window.location.replace("/error?type=server");
          return;
        }
      });
  };

  const handleDeleteCancel = () => {
    setBookToDelete(null);
  };
  return (
    <>
      {/* Filters */}

      <BooksFilters filters={filters} handleFilterChange={handleFilterChange} handleSearch={handleSearch} loading={loading} />

      {/* Table */}
      <Card ref={tableRef} className="border-0 rounded-4 mt-3 overflow-hidden" style={{ background: "var(--surface-raised)" }}>
        <Card.Body className="px-4 py-2">
          <Table responsive hover align="middle" className="bv-admin-table mb-0">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th className="d-none d-md-table-cell">Authors</th>
                <th className="d-none d-md-table-cell">Publisher</th>
                <th className="d-none d-lg-table-cell">Identifiers</th>
                <th className="d-none d-xl-table-cell">Categories</th>
                <th className="d-none d-xxl-table-cell">Published</th>

                <th className="d-none">Description</th>
                <th className="d-none d-xxl-table-cell">Pages</th>

                <th className="d-none d-sm-table-cell">Issues</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-5">
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <Spinner animation="grow" size="sm" style={{ color: "var(--primary-light)" }} />
                      <Spinner animation="grow" size="sm" style={{ color: "var(--accent)" }} />
                      <Spinner animation="grow" size="sm" style={{ color: "var(--st-review)" }} />
                    </div>
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const issues = [];
                  if (!book.authors.length) issues.push("Missing Authors");
                  if (!book.categories.length) issues.push("Missing Categories");
                  if (!book.coverURL) issues.push("Missing Cover");
                  if (!book.description) issues.push("Missing Description");
                  if (!book.publisher) issues.push("Missing Publisher");
                  if (!book.publishedDate) issues.push("Missing Published Date");
                  if (!book.pages) issues.push("Missing Pages");
                  if (!book.isbn10 && !book.isbn13) issues.push("Missing Identifiers");

                  return (
                    <tr key={book.id}>
                      <td>
                        <img src={book.coverURL ? book.coverURL : defaultCover} alt={book.title} className="book-cover rounded-1" />
                      </td>
                      <td>{book.title}</td>
                      <td className="d-none d-md-table-cell">{book.authors.length ? book.authors.join(", ") : "-"}</td>
                      <td className="d-none d-md-table-cell">{book.publisher || "-"}</td>
                      <td className="d-none d-lg-table-cell">
                        {[book.isbn10, book.isbn13].filter(Boolean).length ? [book.isbn10, book.isbn13].filter(Boolean).join(", ") : "-"}
                      </td>
                      <td className="d-none d-xl-table-cell">{book.categories.length ? book.categories.join(", ") : "-"}</td>
                      <td className="d-none d-xxl-table-cell">{book.publishedDate || "-"}</td>

                      <td className="text-truncate d-none" title={book.description}>
                        {book.description ? `${book.description.slice(0, 30)}${book.description.length > 30 ? "..." : ""}` : "-"}
                      </td>
                      <td className="d-none d-xxl-table-cell">{book.pages || "-"}</td>

                      <td className="d-none d-sm-table-cell">
                        <div className="d-flex flex-wrap gap-1">
                          {issues.map((issue) => (
                            <Badge key={issue} bg="toread">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="align-middle text-center">
                        <div className="d-flex flex-column gap-3">
                          <Button
                            size="sm"
                            className="bv-btn-edit"
                            onClick={() => {
                              setSelectedBook(book);
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button size="sm" className="bv-btn-delete" onClick={() => handleDeleteClick(book)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            {/* Pagination */}
            <Pagination className="bv-pagination mb-0">
              <Pagination.Prev
                disabled={isFirst || loading}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(queryFilters.page - 1);
                }}
              />
              {getVisiblePages().map((i) => (
                <Pagination.Item
                  key={i}
                  active={queryFilters.page === i}
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i);
                  }}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={isLast || loading}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(queryFilters.page + 1);
                }}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
      {/* Modals */}
      {showModal && (
        <EditBookModal key={selectedBook?.id} show={showModal} onHide={() => setShowModal(false)} book={selectedBook} handleSaveBook={handleSaveBook} />
      )}
      <DeleteConfirmModal show={!!bookToDelete} onHide={handleDeleteCancel} onConfirm={handleDeleteBook} bookId={bookToDelete?.googleId} />
    </>
  );
};

export default BooksSection;
