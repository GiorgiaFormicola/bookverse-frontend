import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import BookCard from "../BookCard/BookCard";
import DashboardCard from "../DashboardCard";
import EditProfileModal from "../EditProfileModal";
import { HeartFill, Book, BookHalf, BookFill, ThreeDots, ArrowClockwise, Star } from "react-bootstrap-icons";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((currentState) => currentState.profile.user);
  const library = useSelector((currentState) => currentState.profile.savedBooks);
  const [bookshelf, setBookshelf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  const stats = Object.values(library).reduce(
    (acc, book) => {
      acc.saved++;
      if (book.status === "READ") acc.read++;
      if (book.status === "TO_READ") acc.toRead++;
      if (book.status === "READING") acc.reading++;
      return acc;
    },
    { saved: 0, read: 0, toRead: 0, reading: 0 },
  );

  const getUserBookshelf = (pageNumber, append) => {
    instance
      .get(`/me/books?isPublic=true&page=${pageNumber}&size=20`)
      .then((response) => {
        console.log(response.data.content);
        if (append) {
          setBookshelf((prev) => [...prev, ...response.data.content]);
        } else {
          setBookshelf(response.data.content);
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

  const getTotalReviews = () => {
    instance
      .get("/users/me")
      .then((response) => setTotalReviews(response.data.totalReviews))
      .catch((err) => {
        if (err.response?.data?.error === "ACCOUNT_DISABLED") return;
      });
  };

  const loadNextPage = () => {
    getUserBookshelf(currentPage + 1, true);
  };

  useEffect(() => {
    getUserBookshelf(currentPage, false);
    getTotalReviews();
  }, []);

  return (
    <>
      <Container fluid className="d-flex flex-column container-lg py-4 px-3 px-lg-4 px-xl-5  gap-3 gap-sm-2 gap-lg-3 gap-xl-5">
        <Row className=" justify-content-center align-items-end pt-md-2 pt-lg-3 mb-lg-5 mb-xl-2 g-2 g-md-5 g-lg-4">
          <Col xs={12} className="d-md-none text-end">
            <Button onClick={() => navigate("/me/edit")}>Edit profile</Button>
          </Col>
          <Col xs={5} md={4} lg={3} xl={2}>
            <div className="d-flex justify-content-center">
              <img src={user.profilePictureURL} alt={user.username} className="avatar" />
            </div>
          </Col>
          <Col xs={12} className="d-md-none text-center py-2">
            <h1 className="mb-0">{user.displayName}</h1>
          </Col>
          <Col xs={12} md={8} lg={9} xl={8}>
            <div className="d-flex flex-column h-100">
              <div className="d-none d-md-flex justify-content-between align-items-end pb-lg-4 pb-xl-2 mb-3 mb-xl-2 flex-grow-1">
                <h1 className="mb-0">{user.displayName}</h1>
                <Button onClick={() => setShowEditModal(true)}>Edit profile</Button>
              </div>
              <div>
                <Row className="g-2 g-md-2 g-lg-1 align-items-stretch align-items-md-center">
                  <DashboardCard statName="Saved" statValue={stats.saved}>
                    <HeartFill size={30} className="text-danger" />
                  </DashboardCard>
                  <DashboardCard statName="Read" statValue={stats.read}>
                    <BookFill size={30} className="text-success" />
                  </DashboardCard>
                  <DashboardCard statName="Now reading" statValue={stats.reading}>
                    <BookHalf size={30} className="text-info" />
                  </DashboardCard>
                  <DashboardCard statName="Reviewed" statValue={totalReviews} className="d-md-block">
                    <Star size={30} className="text-warning" />
                  </DashboardCard>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
        <Row className=" justify-content-center gap-sm-2 gap-md-3 mt-2 mt-sm-4 mt-md-5 mt-lg-0">
          {user.bio && (
            <Col xl={10}>
              <div>
                <h3 className="mb-3">Biography</h3>
                <p>{user.bio}</p>
              </div>
            </Col>
          )}
          <Col xl={10}>
            <div>
              <h3 className="mt-2 mb-3">Bookshelf</h3>
              <Row className=" justify-content-center g-2 g-md-3 g-xl-3 g-xxl-4 row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-xxl-6">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <Col key={i} className="mb-3">
                      <Card className="bg-transparent border-0">
                        <div className="placeholder-glow rounded-3 book-cover">
                          <div className="placeholder rounded-3 w-100 h-100" />
                        </div>
                      </Card>
                    </Col>
                  ))
                ) : error ? (
                  <div className="d-flex align-items-center justify-content-center gap-3 py-5 w-100">
                    <Alert
                      variant="secondary"
                      className="d-flex flex-column align-items-center justify-content-between mb-0 rounded-3 gap-3 py-4 bg-transparent border-0"
                    >
                      <span>Something went wrong loading your bookshelf.</span>
                      <div className="d-flex flex-column align-items-center gap-2">
                        <span className="fw-bold">Try again</span>
                        <ArrowClockwise
                          size={30}
                          onClick={() => {
                            setError(false);
                            setHasNext(false);
                            getUserBookshelf(0, false);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </Alert>
                  </div>
                ) : bookshelf.length === 0 ? (
                  <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 w-100 gap-3">
                    <Book size={50} className="opacity-50" />
                    <h5 className="mb-0">Your bookshelf is empty</h5>
                    <p className="mb-0 small">To add a saved book to your bookshelf change its privacy to public</p>
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => navigate("/library")}>
                      Go to your library
                    </Button>
                  </div>
                ) : (
                  <>
                    {bookshelf.map((book) => {
                      return <BookCard key={book.id} book={book.info} />;
                    })}
                    {hasNext && (
                      <Col xs={12} className="text-center">
                        <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={() => loadNextPage()} />
                      </Col>
                    )}
                  </>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <EditProfileModal show={showEditModal} handleClose={() => setShowEditModal(false)} />
    </>
  );
};

export default ProfilePage;
