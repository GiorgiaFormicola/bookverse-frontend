import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { instance } from "../config/api";
import { Container, Row, Col, Badge, Alert, ListGroup, Spinner, Form, Button } from "react-bootstrap";
import BookSaveComponent from "./BookSaveComponent";
import BookStatusComponent from "./BookStatusComponent";
import BookReviewComponent from "./BookReviewComponent";
import BookPrivacyComponent from "./BookPrivacyComponent";
import BookStat from "./BookStat";
import Review from "./Review";
import { Star, ThreeDots, StarFill, BookmarkFill, Book as BSBook, ArrowClockwise } from "react-bootstrap-icons";
import { BookCheck, BookOpen, ChevronLeft } from "lucide-react";

const BookDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reviewFormRef = useRef(null);
  const library = useSelector((currentState) => currentState.profile.savedBooks);
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(false);
  const [currentUserReview, setCurrentUserReview] = useState(null);
  const [userReview, setUserReview] = useState({ rating: 0, comment: "" });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [editingReview, setEditingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [bookStats, setBookStats] = useState(null);

  const defaultCover = "https://neelkanthpublishers.com/assets/bookcover_cover.png";

  const mapBookDetails = () => {
    return {
      googleId: book.googleId,
      title: book.title,
      authors: book.authors.length > 0 ? book.authors.join(", ") : "Unknown Author",
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      description: book.description,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      pages: book.pages,
      categories: book.categories,
      coverURL: book.coverURL ? book.coverURL : defaultCover,
    };
  };

  const getBookDetails = () => {
    instance
      .get("/books/search/" + params.googleId)
      .then((response) => {
        setBook(response.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        setBookError(true);
      })
      .finally(() => setBookLoading(false));
  };

  const getBookStats = () => {
    instance
      .get(`/books/${params.googleId}/stats`)
      .then((response) => setBookStats(response.data))
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
      });
  };

  const getBookReviews = (pageNumber, append) => {
    instance
      .get(`/books/${params.googleId}/reviews?&page=${pageNumber}`)
      .then((response) => {
        if (append) {
          setReviews((prev) => [...prev, ...response.data.content]);
        } else {
          setReviews(response.data.content);
          setTotalReviews(response.data.totalElements);
        }
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        setReviewsError(true);
      })
      .finally(() => setReviewsLoading(false));
  };

  const getUserReview = () => {
    const url = `/books/${params.googleId}/reviews/me`;
    console.log("URL:", JSON.stringify(url));
    instance
      .get(url)
      .then((response) => setCurrentUserReview(response.data))
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;

        console.log(err);
      });
  };

  const loadNextPage = () => {
    getBookReviews(currentPage + 1, true);
  };

  const updateReview = (reviewId, body) => {
    instance
      .put("/reviews/" + reviewId, body)
      .then(() => {
        getBookReviews(0, false);
        getUserReview();
      })
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        console.log(err);
      });
  };

  const addReview = (bookId, body) => {
    instance
      .post("/books/" + bookId + "/reviews", body)
      .then(() => {
        getBookReviews(0, false);
        getUserReview();
        getBookStats();
      })
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        console.log(err);
      });
  };

  const deleteReview = (reviewId) => {
    instance
      .delete("/reviews/" + reviewId)
      .then(() => {
        getBookReviews(0, false);
        getBookStats();
        setCurrentUserReview(null);
        setUserReview({ rating: 0, comment: "" });
        setShowForm(false);
        setEditingReview(false);
      })
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
        console.log(err);
      });
  };

  useEffect(() => {
    getBookDetails();
    getBookReviews(0, false);
    getUserReview();
    getBookStats();
  }, []);

  const mappedBook = book ? mapBookDetails() : null;
  const isInLibrary = mappedBook ? library[mappedBook.googleId] : false;
  const isFormDirty = currentUserReview && (userReview.rating !== currentUserReview.rating || userReview.comment !== currentUserReview.comment);

  const handleReviewClick = () => {
    if (currentUserReview) {
      setUserReview({
        rating: currentUserReview.rating,
        comment: currentUserReview.comment,
      });
    } else {
      setUserReview({ rating: 0, comment: "" });
    }
    setShowForm(true);
    setEditingReview(true);
    setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  if (bookLoading || reviewsLoading) {
    return (
      <Container className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (bookError) {
    return (
      <Container className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="bv-empty-state">
          <ArrowClockwise
            size={40}
            className="bv-empty-state__icon"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setBookError(false);
              setBookLoading(true);
              getBookDetails();
            }}
          />
          <h5 className="bv-empty-state__title">Something went wrong</h5>
          <p className="bv-empty-state__text">Something went wrong loading the book.</p>
          <span
            className="bv-empty-state__link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setBookError(false);
              setBookLoading(true);
              getBookDetails();
            }}
          >
            Try again
          </span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="d-flex flex-column container-lg py-4 px-3 px-lg-4 gap-4 gap-lg-3 position-relative">
        <div className="position-absolute top-0 mt-2 pt-1 mt-lg-3">
          <span
            className="d-flex align-items-center gap-1 view-more-link fw-semibold"
            style={{ cursor: "pointer", width: "fit-content" }}
            onClick={() => navigate(location.state?.from || "/", { state: location.state })}
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </span>
        </div>
        {mappedBook && (
          <Row className="justify-content-center gap-4 gap-lg-0 pt-4 pt-lg-4 mt-lg-1 mt-xxl-2">
            <Col xs={12} sm={12} md={12} lg={3} className="align-self-stretch">
              <div className="bv-book-sidebar px-3 py-4 px-sm-4 px-lg-3 px-xl-2 h-100">
                <Row className="g-3 g-sm-4 g-lg-3 justify-content-center">
                  <Col xs={6} sm={5} md={4} lg={12} xl={11}>
                    <img src={mappedBook.coverURL} className="book-cover rounded-3"></img>
                  </Col>
                  <Col xs={6} sm={6} md={8} lg={12} xl={11} className="flex-grow-1 px-lg-2 ms-xl-2 me-xl-2">
                    <div className="d-flex flex-column justify-content-between h-100 gap-3">
                      <div className="flex-grow-1">
                        <BookSaveComponent book={book} />
                      </div>

                      {isInLibrary && (
                        <div className="d-flex flex-column gap-2 flex-grow-1 bv-book-controls py-3">
                          <BookStatusComponent bookId={book.googleId} />
                          <BookPrivacyComponent bookId={book.googleId} />
                        </div>
                      )}

                      {!isInLibrary && bookStats && (
                        <div className="d-flex flex-column gap-2 flex-grow-1">
                          <div className="d-flex gap-2 flex-grow-1">
                            <BookStat statValue={bookStats.saved} statName="saved" color="saved">
                              <BookmarkFill size={20} className="text-saved" />
                            </BookStat>
                            <BookStat statValue={bookStats.read} statName="read" color="read">
                              <BookCheck size={20} className="text-read" />
                            </BookStat>
                          </div>
                          <div className="d-flex gap-2 flex-grow-1">
                            <BookStat statValue={bookStats.reading} statName="reading" color="reading">
                              <BookOpen size={20} className="text-reading" />
                            </BookStat>
                            <BookStat statValue={bookStats.reviews} statName="reviews" color="review">
                              <Star size={20} className="text-review" />
                            </BookStat>
                          </div>
                        </div>
                      )}

                      <div className="flex-grow-1">
                        <BookReviewComponent isReviewed={!!currentUserReview} handleReviewClick={handleReviewClick} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={9}>
              <Row className="g-3">
                <Col xs={12} className="order-lg-0">
                  <div className="mt-lg-3">
                    <h1 className="display-font mb-2">{mappedBook.title}</h1>
                    <h4 className="text-muted mb-1">by {mappedBook.authors}</h4>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="d-flex flex-wrap gap-2">
                    {mappedBook.categories.map((category, i) => (
                      <Badge key={i} bg="accent" className="rounded-pill">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </Col>
                <Col xs={12} className="order-lg-2 pb-xxl-4">
                  {mappedBook.description && (
                    <div className="mb-2">
                      <p className="text-muted mb-0">{mappedBook.description}</p>
                    </div>
                  )}
                </Col>

                <Col xs={12} className="order-lg-1 ">
                  <div className="text-muted small d-flex flex-wrap gap-3 justify-content-between">
                    {mappedBook.publisher && (
                      <p className="mb-1 mb-lg-0">
                        Publisher: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.publisher}</span>
                      </p>
                    )}
                    {mappedBook.publishedDate && (
                      <p className="mb-1 mb-lg-0">
                        Published: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.publishedDate}</span>
                      </p>
                    )}
                    {mappedBook.pages && (
                      <p className="mb-1 mb-lg-0">
                        Pages: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.pages}</span>
                      </p>
                    )}
                    {(mappedBook.isbn10 || mappedBook.isbn13) && (
                      <p className="mb-1 mb-lg-0">
                        ISBN: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.isbn10 ? mappedBook.isbn10 : mappedBook.isbn13}</span>
                      </p>
                    )}
                  </div>
                </Col>
                <Col xs={12} className=" order-last pt-2 pt-lg-0">
                  <h5 className="mb-3">Rewiews ({totalReviews})</h5>
                  {!reviewsLoading && !reviewsError && totalReviews === 0 && (
                    <div className="bv-empty-state py-3">
                      <BSBook size={40} className="bv-empty-state__icon" />
                      <h5 className="bv-empty-state__title">No reviews yet</h5>
                      <p className="bv-empty-state__text">Be the first to review this book!</p>
                    </div>
                  )}
                  {reviewsError ? (
                    <div className="bv-empty-state">
                      <ArrowClockwise
                        size={40}
                        className="bv-empty-state__icon"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setReviewsError(false);
                          setReviewsLoading(true);
                          getBookReviews(0, false);
                        }}
                      />
                      <h5 className="bv-empty-state__title">Something went wrong</h5>
                      <p className="bv-empty-state__text">Something went wrong loading reviews.</p>
                      <span
                        className="bv-empty-state__link"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setReviewsError(false);
                          setReviewsLoading(true);
                          getBookReviews(0, false);
                        }}
                      >
                        Try again
                      </span>
                    </div>
                  ) : (
                    <Col xs={12}>
                      <ListGroup variant="flush">
                        {reviews.map((review) => (
                          <Review key={review.id} review={review} isUserReview={false} />
                        ))}
                        {hasNext && (
                          <Col xs={12} className="text-center">
                            <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={loadNextPage} />
                          </Col>
                        )}
                      </ListGroup>

                      {currentUserReview && !editingReview && (
                        <div className="bv-review-own-divider">
                          <Review
                            key={currentUserReview.id}
                            review={currentUserReview}
                            isUserReview={true}
                            handleReviewClick={handleReviewClick}
                            setUserReview={setUserReview}
                          />
                        </div>
                      )}
                    </Col>
                  )}

                  {showForm && (
                    <Col xs={12} ref={reviewFormRef}>
                      <div className="bv-review-form mt-3">
                        <h5 className="fw-semibold mb-3">{currentUserReview ? "Edit" : "Leave"} your review</h5>

                        <div className="d-flex gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarFill
                              key={star}
                              size={26}
                              role="button"
                              className={star <= (hoveredRating || userReview.rating) ? "text-accent" : "text-faint opacity-25"}
                              style={{ cursor: "pointer" }}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setUserReview({ ...userReview, rating: star })}
                            />
                          ))}
                        </div>

                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (userReview.rating === 0 || userReview.comment.trim() === "") return;
                            if (currentUserReview) {
                              updateReview(currentUserReview.id, userReview);
                            } else {
                              addReview(params.googleId, userReview);
                            }
                            setShowForm(false);
                            setEditingReview(false);
                            setUserReview({ rating: 0, comment: "" });
                          }}
                        >
                          <Form.Group className="mb-3">
                            <Form.Control
                              as="textarea"
                              rows={5}
                              placeholder="Share with other readers your opinion..."
                              className="shadow-none"
                              value={userReview.comment}
                              onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                            />
                          </Form.Group>

                          <div className="d-flex justify-content-between align-items-center">
                            <small style={{ color: "var(--text-faint)" }}>
                              {userReview.rating > 0 ? `${userReview.rating}/5 selected` : "Select a rating"}
                            </small>
                            <div className="d-flex gap-2">
                              <Button
                                type="button"
                                className="px-4 fw-semibold bv-btn-close"
                                onClick={() => {
                                  setShowForm(false);
                                  setEditingReview(false);
                                  setUserReview({ rating: 0, comment: "" });
                                }}
                              >
                                Close
                              </Button>
                              <Button
                                type="submit"
                                disabled={userReview.rating === 0 || userReview.comment.trim() === "" || (currentUserReview && !isFormDirty)}
                                className="px-4 fw-semibold bv-btn-confirm"
                              >
                                {currentUserReview ? "Edit" : "Publish"}
                              </Button>
                              {currentUserReview && (
                                <Button type="button" className="px-4 fw-semibold bv-btn-delete" onClick={() => deleteReview(currentUserReview.id)}>
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        </Form>
                      </div>
                    </Col>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default BookDetailPage;
