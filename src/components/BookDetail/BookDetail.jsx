import { Container, Row, Col, ListGroup, InputGroup, Form, Spinner, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import { useSelector } from "react-redux";
import BookSaveComponent from "../BookSaveComponent/BookSaveComponent";
import BookStatusComponent from "../BookStatusComponent/BookStatusComponent";
import BookPrivacyComponent from "../BookPrivacyComponent/BookPrivacyComponent";
import BookReviewComponent from "../BookReviewComponent/BookReviewComponent";
import Review from "../Review/Review";
import { StarFill, ThreeDots } from "react-bootstrap-icons";

//gestire loading e errore
const BookDetail = () => {
  const params = useParams();
  const [booksLoading, setBooksLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [bookDetailsMapped, setBookDetailsMapped] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: "" });
  /*   const [bookError, setBookError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null); */
  const userProfile = useSelector((currentState) => currentState.profile);
  const userSavedBooks = userProfile.savedBooks;
  const userInfo = userProfile.user;
  const defaultCover = "https://neelkanthpublishers.com/assets/bookcover_cover.png";
  const [hoveredRating, setHoveredRating] = useState(0);

  const [editingReview, setEditingReview] = useState(false);
  const currentUserReview = reviews.find((review) => review.user?.id === userInfo?.id);
  const shouldShowReviewForm = !currentUserReview || editingReview;

  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  const componentLoading = booksLoading || reviewsLoading;

  const mapBookDetails = (data) => {
    return {
      googleId: data.googleId,
      title: data.title,
      authors: data.authors.length > 0 ? data.authors.join(", ") : "Unknown",
      publisher: data.publisher ? data.publisher : "Unknown",
      publishedDate: data.publishedDate ? data.publishedDate : "Unknown",
      description: data.description,
      isbn10: data.isbn10 ? data.isbn10 : "Not available",
      isbn13: data.isbn13 ? data.isbn13 : "Not available",
      pages: data.pages ? data.pages : "Not available",
      categories: data.categories.length > 0 ? data.categories.join(", ") : "Not available",
      coverURL: data.coverURL ? data.coverURL : defaultCover,
    };
  };

  const getBookDetails = () => {
    instance
      .get("/books/search/" + params.googleId)
      .then((response) => {
        console.log(response.data);
        setBook(response.data);
        setBookDetailsMapped(mapBookDetails(response.data));
        setBooksLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setBooksLoading(false);
        /* setBookError(err); */
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
        }
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
        setReviewsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setReviewsLoading(false);
        /* setReviewsError(err); */
      });
  };

  const loadNextPage = () => {
    const nextPage = currentPage + 1;
    getBookReviews(nextPage, true);
  };

  const updateReview = (reviewId, body) => {
    instance
      .put("/reviews/" + reviewId, body)
      .then((response) => {
        console.log(response.data);
        getBookReviews(0, false);
      })
      .catch((err) => {
        console.log(err);
        /* setReviewsLoading(false); */
        /* setReviewsError(err); */
      });
  };

  const addReview = (bookId, body) => {
    instance
      .post("/books/" + bookId + "/reviews", body)
      .then((response) => {
        console.log(response.data);
        getBookReviews(0, false);
      })
      .catch((err) => {
        console.log(err);
        /*  setReviewsLoading(false); */
        /* setReviewsError(err); */
      });
  };

  const deleteReview = (reviewId) => {
    instance
      .delete("/reviews/" + reviewId)
      .then((response) => {
        console.log(response.data);
        getBookReviews(0, false);
        setUserReview({ rating: 0, comment: "" });
      })
      .catch((err) => {
        console.log(err);
        /*  setReviewsLoading(false); */
        /* setReviewsError(err); */
      });
  };

  useEffect(() => {
    getBookDetails();
    getBookReviews(0, false);
  }, []);

  return (
    <>
      <div className="sticky-top bg-secondary" style={{ height: "4rem" }}>
        TOP NAVBAR
      </div>
      {componentLoading && (
        <Container className="min-vh-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </Container>
      )}
      {!componentLoading && (
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
                            {/* <div className="d-flex align-items-center gap-2 py-3 flex-shrink-0">
                            <BookReviewComponent />
                          </div> */}
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
              </>
            )}
          </Row>

          <Row className="g-3">
            <Col xs={12}>
              <h3 className="mb-0">Reviews</h3>
            </Col>
            <Col xs={12}>
              <ListGroup variant="flush" className="border-top border-bottom border-1">
                {reviews
                  .filter((review) => review.user.id !== userInfo.id)
                  .map((review) => {
                    return <Review key={review.id} info={review} isUserReview={false}></Review>;
                  })}
                {hasNext && (
                  <Col xs={12} className="text-center">
                    <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={() => loadNextPage()}></ThreeDots>
                  </Col>
                )}
                {currentUserReview && !editingReview && (
                  <Review
                    key={currentUserReview.id}
                    info={currentUserReview}
                    isUserReview={true}
                    setEditingReview={setEditingReview}
                    setUserReview={setUserReview}
                  ></Review>
                )}
              </ListGroup>
            </Col>
            {shouldShowReviewForm && (
              <Col>
                <div className=" p-3 shadow-sm">
                  <h5 className="fw-semibold mb-3">{currentUserReview ? "Edit" : "Leave"} your review</h5>
                  <div className="d-flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star, i) => (
                      <StarFill
                        key={star + i}
                        size={28}
                        role="button"
                        className={star <= (hoveredRating || userReview.rating) ? "text-primary" : "text-secondary opacity-25"}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() =>
                          setUserReview({
                            ...userReview,
                            rating: star,
                          })
                        }
                      />
                    ))}
                  </div>

                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();

                      if (userReview.rating === 0 || userReview.comment.trim() === "") {
                        return;
                      }

                      if (currentUserReview) {
                        updateReview(currentUserReview.id, userReview);
                      } else {
                        addReview(params.googleId, userReview);
                      }

                      setEditingReview(false);
                      setUserReview({
                        rating: 0,
                        comment: "",
                      });
                    }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Share with other readers your opinion..."
                        className="rounded-4 border-secondary-subtle shadow-none"
                        value={userReview.comment}
                        onChange={(e) =>
                          setUserReview({
                            ...userReview,
                            comment: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">{userReview.rating > 0 ? `${userReview.rating}/5 selected` : "Select a rating"}</small>
                      <div className="d-flex gap-2">
                        <Button type="submit" disabled={userReview.rating === 0 || userReview.comment.trim() === ""} className="rounded-pill px-4 fw-semibold">
                          {currentUserReview ? "Edit" : "Publish"}
                        </Button>
                        {currentUserReview && (
                          <Button
                            type="button"
                            className="rounded-pill px-4 fw-semibold bg-danger border-danger"
                            onClick={() => {
                              deleteReview(currentUserReview.id);
                            }}
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
          </Row>
        </Container>
      )}

      <div className=" sticky-bottom bg-secondary" style={{ height: "6rem" }}>
        BOTTOM NAVBAR
      </div>
    </>
  );
};

export default BookDetail;
