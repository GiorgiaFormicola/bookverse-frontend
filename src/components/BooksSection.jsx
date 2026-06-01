import { useState, useEffect } from "react";
import { Card, Badge, Table, Button, Pagination } from "react-bootstrap";
import BooksFilters from "./BooksFilters";
import EditBookModal from "./EditBookModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { instance } from "../config/api";

const BooksSection = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const defaultCover = "https://neelkanthpublishers.com/assets/bookcover_cover.png";

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
        console.log(response.data);
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBooks(queryFilters);
  }, [queryFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setQueryFilters((prev) => ({
      ...prev,
      ...filters,
      page: 0,
    }));
  };

  const handlePageChange = (page) => {
    setQueryFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSaveBook = () => {
    getBooks(queryFilters);

    setShowModal(false);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
  };

  const handleDeleteBook = () => {
    instance
      .delete("/books/" + bookToDelete.googleId)
      .then((response) => {
        console.log(response);
        getBooks(queryFilters);
      })
      .catch((err) => console.log(err))
      .finally(() => setBookToDelete(null));
  };

  const handleDeleteCancel = () => {
    setBookToDelete(null);
  };
  return (
    <>
      <BooksFilters filters={filters} handleFilterChange={handleFilterChange} handleSearch={handleSearch} />

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <Table responsive hover align="middle">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th className="d-none d-sm-table-cell">Authors</th>
                <th className="d-none d-md-table-cell">Publisher</th>
                <th className="d-none d-xl-table-cell">Published Date</th>
                <th className="d-none d-md-table-cell">Categories</th>
                <th className="d-none">Description</th>
                <th className="d-none d-xxl-table-cell">Pages</th>
                <th className="d-none d-lg-table-cell">Identifiers</th>
                <th className="d-none d-sm-table-cell">Issues</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => {
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
                      <img src={book.coverURL ? book.coverURL : defaultCover} alt={book.title} className="book-cover rounded-3" />
                    </td>

                    <td>{book.title}</td>
                    <td className="d-none d-sm-table-cell">{book.authors.length ? book.authors.join(", ") : "-"}</td>
                    <td className="d-none d-md-table-cell">{book.publisher || "-"}</td>
                    <td className="d-none d-xl-table-cell">{book.publishedDate || "-"}</td>

                    <td className="d-none d-md-table-cell">{book.categories.length ? book.categories.join(", ") : "-"}</td>
                    <td className="text-truncate d-none" title={book.description}>
                      {book.description ? `${book.description.slice(0, 30)}${book.description.length > 30 ? "..." : ""}` : "-"}
                    </td>
                    <td className="d-none d-xxl-table-cell">{book.pages || "-"}</td>
                    <td className="d-none d-lg-table-cell">
                      {[book.isbn10, book.isbn13].filter(Boolean).length ? [book.isbn10, book.isbn13].filter(Boolean).join(", ") : "-"}
                    </td>

                    <td className="d-none d-sm-table-cell">
                      <div className="d-flex flex-wrap gap-1">
                        {issues.map((issue) => (
                          <Badge key={issue} bg="warning" text="dark">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    <td className="align-middle text-center">
                      <div className="d-flex flex-column gap-3">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setSelectedBook(book);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>

                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteClick(book)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.Prev disabled={queryFilters.page === 0} onClick={() => handlePageChange(queryFilters.page - 1)} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i} active={queryFilters.page === i} onClick={() => handlePageChange(i)}>
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next disabled={queryFilters.page + 1 >= totalPages} onClick={() => handlePageChange(queryFilters.page + 1)} />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
      {showModal && (
        <EditBookModal key={selectedBook?.id} show={showModal} onHide={() => setShowModal(false)} book={selectedBook} handleSaveBook={handleSaveBook} />
      )}

      <DeleteConfirmModal show={!!bookToDelete} onHide={handleDeleteCancel} onConfirm={handleDeleteBook} bookId={bookToDelete?.googleId} />
    </>
  );
};

export default BooksSection;
