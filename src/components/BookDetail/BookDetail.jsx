import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import { useSelector } from "react-redux";
import BookSaveComponent from "../BookSaveComponent/BookSaveComponent";
import BookStatusComponent from "../BookStatusComponent/BookStatusComponent";
import BookPrivacyComponent from "../BookPrivacyComponent/BookPrivacyComponent";
import BookReviewButton from "../BookReviewButton/BookReviewButton";

//gestire loading e errore
const BookDetail = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [bookDetailsMapped, setBookDetailsMapped] = useState(null);
  const [reviews, setReviews] = useState(null);
  const userSavedBooks = useSelector((currentState) => currentState.profile.savedBooks);

  const mapBookDetails = (data) => {
    return {
      googleId: data.googleId,
      title: data.title,
      authors: data.authors.length > 0 ? data.authors.join(", ") : "Unknown",
      publisher: data.publisher ? data.publisher : "Unknown",
      publishedDate: data.publishedDate ? data.publishedDate : "Unknown",
      description: data.description,
      isbn10: data.isbn10 ? data.isbn13 : "Not available",
      isbn13: data.isbn13 ? data.isbn13 : "Not available",
      pages: data.pages ? data.pages : "Not available",
      categories: data.categories.length > 0 ? data.categories.join(", ") : "Not available",
      coverURL: data.coverURL,
    };
  };

  const getBookDetails = () => {
    instance
      .get("/books/search/" + params.googleId)
      .then((response) => {
        setBook(response.data);
        setBookDetailsMapped(mapBookDetails(response.data));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBookReviews = () => {
    instance
      .get("/books/" + params.googleId + "/reviews")
      .then((response) => {
        setReviews(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getBookDetails();
    getBookReviews();
  }, []);

  return (
    <>
      <div className="sticky-top bg-secondary" style={{ height: "4rem" }}>
        TOP NAVBAR
      </div>
      <Container fluid className="min-vh-100 py-4 d-flex flex-column gap-4">
        <Row className="gap-3">
          {bookDetailsMapped && userSavedBooks && (
            <>
              <Col xs={12}>
                <Row className=" justify-content-start">
                  <Col xs={6}>
                    <img src={bookDetailsMapped.coverURL} className="book-cover"></img>
                  </Col>
                  <Col xs={6}>
                    {!userSavedBooks[bookDetailsMapped.googleId] && (
                      <div className="d-flex flex-column h-100">
                        <div className="d-flex align-items-center gap-2 py-3 flex-shrink-0">
                          <BookSaveComponent book={book} />
                        </div>
                        <div className="small d-flex flex-column gap-1 flex-grow-1 justify-content-between">
                          <p className="mb-0">X users have already saved this book on their library!</p>
                          <p className="mb-0">X users are reading this book right now!</p>
                          <p className="mb-0">X users have already read this book!</p>
                          <p className="mb-0">X users have reviewed this book!</p>
                        </div>
                      </div>
                    )}

                    {userSavedBooks[bookDetailsMapped.googleId] && (
                      <div className="d-flex flex-column h-100">
                        <div className="d-flex align-items-center gap-2 py-3 flex-shrink-0">
                          <BookSaveComponent book={book} />
                        </div>
                        <div className="small d-flex flex-column gap-1 flex-grow-1 justify-content-between">
                          <div className="d-flex align-items-center gap-2 py-3 flex-shrink-0">
                            <BookStatusComponent bookId={book.googleId} />
                          </div>
                          <div className="d-flex align-items-center gap-2 py-3 flex-shrink-0">
                            <BookPrivacyComponent bookId={book.googleId} />
                          </div>
                          <div className="d-flex align-items-center gap-2 py-3 flex-shrink-0">
                            <BookReviewButton />
                            <p className="mb-0">Unsave from library</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col xs={11}>
                <h2 className="mb-0">{bookDetailsMapped.title}</h2>
              </Col>
              <Col xs={12}>{bookDetailsMapped.description && <p className="mb-0">{bookDetailsMapped.description}</p>}</Col>
              <Col xs={11}>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="small mb-0">Authors:</p>
                    <p className="small mb-0">{bookDetailsMapped.authors}</p>
                  </div>
                  <div>
                    <p className="small mb-0">Publisher:</p>
                    <p className="small mb-0">{bookDetailsMapped.publisher}</p>
                  </div>
                  <div>
                    <p className="small mb-0">Published date:</p>
                    <p className="small mb-0">{bookDetailsMapped.publishedDate}</p>
                  </div>
                </div>
              </Col>
              <Col></Col>
            </>
          )}
        </Row>
      </Container>
      <div className=" sticky-bottom bg-secondary" style={{ height: "6rem" }}>
        BOTTOM NAVBAR
      </div>
    </>
  );
};

export default BookDetail;
