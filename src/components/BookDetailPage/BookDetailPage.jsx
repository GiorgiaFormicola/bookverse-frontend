import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { instance } from "../../config/api";
import { Container, Row, Col, Badge, Card, Alert, ListGroup, Spinner, Form, Button } from "react-bootstrap";
import BookSaveComponent from "../BookSaveComponent/BookSaveComponent";
import BookStatusComponent from "../BookStatusComponent/BookStatusComponent";
import BookReviewComponent from "../BookReviewComponent/BookReviewComponent";
import BookPrivacyComponent from "../BookPrivacyComponent/BookPrivacyComponent";
import BookStat from "../BookStat";
import Review from "../Review/Review";
import { BookFill, BookHalf, People, Star, ThreeDots, StarFill, Book } from "react-bootstrap-icons";

const BookDetailPage = () => {
  const params = useParams();
  const reviewFormRef = useRef(null);
  const library = useSelector((currentState) => currentState.profile.savedBooks);
  const user = useSelector((currentState) => currentState.profile.user);
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 0, comment: "" });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [editingReview, setEditingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
        console.log(response.data);
        setBook(response.data);
      })
      .catch((err) => {
        console.log(err);
        setBookError(true);
      })
      .finally(() => setBookLoading(false));
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
        setReviewsError(true);
      })
      .finally(() => setReviewsLoading(false));
  };

  const loadNextPage = () => {
    getBookReviews(currentPage + 1, true);
  };

  const updateReview = (reviewId, body) => {
    instance
      .put("/reviews/" + reviewId, body)
      .then(() => getBookReviews(0, false))
      .catch((err) => console.log(err));
  };

  const addReview = (bookId, body) => {
    instance
      .post("/books/" + bookId + "/reviews", body)
      .then(() => getBookReviews(0, false))
      .catch((err) => console.log(err));
  };

  const deleteReview = (reviewId) => {
    instance
      .delete("/reviews/" + reviewId)
      .then(() => {
        getBookReviews(0, false);
        setUserReview({ rating: 0, comment: "" });
        setShowForm(false);
        setEditingReview(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBookDetails();
    getBookReviews(0, false);
  }, []);

  const mappedBook = book ? mapBookDetails() : null;
  const isInLibrary = mappedBook ? library[mappedBook.googleId] : false;
  const currentUserReview = reviews.find((review) => review.user?.id === user?.id) ?? null;
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
      <Container className="py-4">
        <Alert variant="danger">
          Something went wrong loading the book.
          <Alert.Link
            onClick={() => {
              setBookError(false);
              setBookLoading(true);
              getBookDetails();
            }}
          >
            Try again
          </Alert.Link>
        </Alert>
      </Container>
    );
  }

  /* return (
    <>
      <Container fluid className="py-4 p-3 px-lg-4 px-xl-5 container-lg d-flex flex-column gap-3 gap-sm-2 gap-lg-3 ">
        {mappedBook && (
          <Row className="justify-content-center gap-4 gap-lg-0">
            <Col xs={12} sm={11} md={10} lg={3}>
              <Row className="g-2 g-sm-3">
                <Col xs={6} sm={5} lg={12} xl={11}>
                  <img src={mappedBook.coverURL} className="book-cover rounded-3"></img>
                </Col>
                <Col xs={6} sm={7} lg={12} xl={11}>
                  <div className="d-flex flex-column justify-content-between h-100 gap-2">
                    <BookSaveComponent book={book} />
                    {isInLibrary && (
                      <>
                        <BookStatusComponent bookId={book.googleId} />
                        <BookPrivacyComponent bookId={book.googleId} />
                      </>
                    )}
                    {!isInLibrary && (
                      <>
                        <div className="d-flex align-items-center rounded-3 gap-2 flex-grow-1">
                          <BookStat statValue="1.9K" statName="saved">
                            <People size={25} className="text-primary" />
                          </BookStat>
                          <BookStat statValue="1.3K" statName="read">
                            <BookFill size={25} className="text-success" />
                          </BookStat>
                        </div>
                        <div className="d-flex align-items-center rounded-3 gap-2  flex-grow-1">
                          <BookStat statValue="1K" statName="reading">
                            <BookHalf size={25} className="text-info" />
                          </BookStat>
                          <BookStat statValue="1.7K" statName="reviews">
                            <Star size={25} className="text-warning" />
                          </BookStat>
                        </div>
                      </>
                    )}
                    <BookReviewComponent isReviewed={!!currentUserReview} handleReviewClick={handleReviewClick} />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={11} md={10} lg={9}>
              <Row>
                <Col xs={12} className="order-lg-0">
                  <div>
                    <h1 className="display-font mb-2" >{mappedBook.title}</h1>
                    <h4 className="text-muted mb-3">by {mappedBook.authors}</h4>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {mappedBook.categories.map((category, i) => (
                      <Badge key={i} bg="primary rounded-pill">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </Col>
                <Col xs={12} className="order-lg-2">
                  {mappedBook.description && (
                    <div className="mb-2">
                      <Card className="border-0 shadow-sm mb-2 mb-lg-4">
                        <Card.Body>
                          <h5 className="mb-3">Description</h5>
                          <p className="text-muted mb-1">{mappedBook.description}</p>
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                </Col>

                <Col xs={12} className="order-lg-1 ">
                  <div className="text-muted small d-flex flex-wrap gap-3 justify-content-between mb-lg-2">
                    {mappedBook.publisher && (
                      <p className="mb-1">
                        Publisher: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.publisher}</span>
                      </p>
                    )}
                    {mappedBook.publishedDate && (
                      <p className="mb-1">
                        Published: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.publishedDate}</span>
                      </p>
                    )}
                    {mappedBook.pages && (
                      <p className="mb-1">
                        Pages: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.pages}</span>
                      </p>
                    )}
                    {(mappedBook.isbn10 || mappedBook.isbn13) && (
                      <p className="mb-1">
                        ISBN: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.isbn10 ? mappedBook.isbn10 : mappedBook.isbn13}</span>
                      </p>
                    )}
                  </div>
                </Col>
                <Col xs={12} className=" order-last">
                  <Card className="border-0 shadow-sm mt-3 mt-lg-0">
                    <Card.Body>
                      <h5 className="mb-3">Rewiews ({totalReviews})</h5>
                      {reviewsError ? (
                        <Col xs={12}>
                          <Alert variant="danger">
                            Something went wrong loading reviews.{" "}
                            <Alert.Link
                              onClick={() => {
                                setReviewsError(false);
                                setReviewsLoading(true);
                                getBookReviews(0, false);
                              }}
                            >
                              Try again
                            </Alert.Link>
                          </Alert>
                        </Col>
                      ) : (
                        <Col xs={12}>
                          <ListGroup variant="flush" className="border-top">
                            {reviews
                              .filter((review) => review.user?.id !== user?.id)
                              .map((review) => (
                                <Review key={review.id} review={review} isUserReview={false} />
                              ))}
                            {hasNext && (
                              <Col xs={12} className="text-center">
                                <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={loadNextPage} />
                              </Col>
                            )}
                            {currentUserReview && !editingReview && (
                              <Review
                                key={currentUserReview.id}
                                review={currentUserReview}
                                isUserReview={true}
                                handleReviewClick={handleReviewClick}
                                setUserReview={setUserReview}
                              />
                            )}
                          </ListGroup>
                        </Col>
                      )}

                      {showForm && (
                        <Col ref={reviewFormRef}>
                          <div className="pb-3 pt-4 px-2 shadow-sm border-top">
                            <h5 className="fw-semibold mb-3">{currentUserReview ? "Edit" : "Leave"} your review</h5>
                            <div className="d-flex gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarFill
                                  key={star}
                                  size={28}
                                  role="button"
                                  className={star <= (hoveredRating || userReview.rating) ? "text-primary" : "text-secondary opacity-25"}
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
                                  className="rounded-3 border-secondary-subtle shadow-none"
                                  value={userReview.comment}
                                  onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                                />
                              </Form.Group>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">{userReview.rating > 0 ? `${userReview.rating}/5 selected` : "Select a rating"}</small>
                                <div className="d-flex gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-4 fw-semibold"
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
                                    className="px-4 fw-semibold"
                                  >
                                    {currentUserReview ? "Edit" : "Publish"}
                                  </Button>
                                  {currentUserReview && (
                                    <Button
                                      type="button"
                                      className="px-4 fw-semibold bg-danger border-danger"
                                      onClick={() => deleteReview(currentUserReview.id)}
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Form>
                          </div>
                        </Col>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </>
  ); */
  return (
    <>
      <Container fluid className="d-flex flex-column container-lg py-4 px-3 px-lg-4 gap-4 gap-lg-3">
        {mappedBook && (
          <Row className="justify-content-center gap-4 gap-lg-0 pt-2">
            <Col xs={12} sm={12} md={12} lg={3}>
              <Row className="g-2 g-sm-4">
                <Col xs={6} sm={5} md={4} lg={12} xl={11}>
                  <img src={mappedBook.coverURL} className="book-cover rounded-3"></img>
                </Col>
                <Col xs={6} sm={6} md={8} lg={12} xl={11} className="flex-grow-1 px-4 px-lg-2">
                  <div className="d-flex flex-column justify-content-between h-100 gap-3">
                    <BookSaveComponent book={book} />
                    {isInLibrary && (
                      <div className="d-flex flex-column gap-1 flex-grow-1 bg-dark rounded-3 py-2">
                        <BookStatusComponent bookId={book.googleId} />
                        <BookPrivacyComponent bookId={book.googleId} />
                      </div>
                    )}
                    {!isInLibrary && (
                      <>
                        <div className="d-flex align-items-center rounded-3 gap-2 flex-grow-1">
                          <BookStat statValue="1.9K" statName="saved">
                            <People size={25} className="text-primary" />
                          </BookStat>
                          <BookStat statValue="1.3K" statName="read">
                            <BookFill size={25} className="text-success" />
                          </BookStat>
                        </div>
                        <div className="d-flex align-items-center rounded-3 gap-2  flex-grow-1">
                          <BookStat statValue="1K" statName="reading">
                            <BookHalf size={25} className="text-info" />
                          </BookStat>
                          <BookStat statValue="1.7K" statName="reviews">
                            <Star size={25} className="text-warning" />
                          </BookStat>
                        </div>
                      </>
                    )}
                    <BookReviewComponent isReviewed={!!currentUserReview} handleReviewClick={handleReviewClick} />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={9}>
              <Row className="g-3">
                <Col xs={12} className="order-lg-0">
                  <div>
                    <h1 className="display-font mb-2">{mappedBook.title}</h1>
                    <h4 className="text-muted mb-1">by {mappedBook.authors}</h4>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="d-flex flex-wrap gap-2">
                    {mappedBook.categories.map((category, i) => (
                      <Badge key={i} bg="primary rounded-pill">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </Col>
                <Col xs={12} className="order-lg-2">
                  {mappedBook.description && (
                    <div className="mb-2">
                      {/* <Card className="border-0 shadow-sm mb-2 mb-lg-4">
                        <Card.Body> */}
                      {/* <h5 className="mb-3">Description</h5> */}
                      <p className="text-muted mb-0">{mappedBook.description}</p>
                      {/*  </Card.Body>
                      </Card> */}
                    </div>
                  )}
                </Col>

                <Col xs={12} className="order-lg-1 ">
                  <div className="text-muted small d-flex flex-wrap gap-3 justify-content-between mb-lg-2">
                    {mappedBook.publisher && (
                      <p className="mb-1">
                        Publisher: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.publisher}</span>
                      </p>
                    )}
                    {mappedBook.publishedDate && (
                      <p className="mb-1">
                        Published: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.publishedDate}</span>
                      </p>
                    )}
                    {mappedBook.pages && (
                      <p className="mb-1">
                        Pages: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.pages}</span>
                      </p>
                    )}
                    {(mappedBook.isbn10 || mappedBook.isbn13) && (
                      <p className="mb-1">
                        ISBN: <br className="d-lg-none" />
                        <span className="text-light">{mappedBook.isbn10 ? mappedBook.isbn10 : mappedBook.isbn13}</span>
                      </p>
                    )}
                  </div>
                </Col>
                <Col xs={12} className=" order-last pt-2">
                  {/* <Card className="border-0 shadow-sm mt-3 mt-lg-0">
                    <Card.Body> */}
                  <h5 className="mb-3">Rewiews ({totalReviews})</h5>
                  {!reviewsLoading && !reviewsError && totalReviews === 0 && (
                    <div className="text-center text-muted py-4">
                      <Book size={40} className="mb-2 opacity-50" />
                      <p className="mb-1">No reviews yet.</p>
                      <span className="small">Be the first to review this book!</span>
                    </div>
                  )}
                  {reviewsError ? (
                    <Col xs={12}>
                      <Alert variant="danger">
                        Something went wrong loading reviews.{" "}
                        <Alert.Link
                          onClick={() => {
                            setReviewsError(false);
                            setReviewsLoading(true);
                            getBookReviews(0, false);
                          }}
                        >
                          Try again
                        </Alert.Link>
                      </Alert>
                    </Col>
                  ) : (
                    <Col xs={12}>
                      <ListGroup variant="flush">
                        {reviews
                          .filter((review) => review.user?.id !== user?.id)
                          .map((review) => (
                            <Review key={review.id} review={review} isUserReview={false} />
                          ))}
                        {hasNext && (
                          <Col xs={12} className="text-center">
                            <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={loadNextPage} />
                          </Col>
                        )}
                        {currentUserReview && !editingReview && (
                          <Review
                            key={currentUserReview.id}
                            review={currentUserReview}
                            isUserReview={true}
                            handleReviewClick={handleReviewClick}
                            setUserReview={setUserReview}
                          />
                        )}
                      </ListGroup>
                    </Col>
                  )}

                  {showForm && (
                    <Col xs={12} ref={reviewFormRef}>
                      <div className=" pt-3 border-top border-light border-opacity-50 ">
                        <h5 className="fw-semibold mb-3">{currentUserReview ? "Edit" : "Leave"} your review</h5>
                        <div className="d-flex gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarFill
                              key={star}
                              size={28}
                              role="button"
                              className={star <= (hoveredRating || userReview.rating) ? "text-primary" : "text-light opacity-25"}
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
                              className="rounded-3 border-secondary-subtle shadow-none"
                              value={userReview.comment}
                              onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                            />
                          </Form.Group>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{userReview.rating > 0 ? `${userReview.rating}/5 selected` : "Select a rating"}</small>
                            <div className="d-flex gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                className="px-4 fw-semibold rounded-pill"
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
                                className="px-4 fw-semibold rounded-pill"
                              >
                                {currentUserReview ? "Edit" : "Publish"}
                              </Button>
                              {currentUserReview && (
                                <Button
                                  type="button"
                                  className="px-4 fw-semibold bg-danger border-danger rounded-pill"
                                  onClick={() => deleteReview(currentUserReview.id)}
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        </Form>
                      </div>
                    </Col>
                  )}
                  {/*    </Card.Body>
                  </Card> */}
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
