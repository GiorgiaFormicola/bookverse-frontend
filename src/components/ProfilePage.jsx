import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { instance } from "../config/api";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import BookCard from "./BookCard";
import DashboardCard from "./DashboardCard";
import EditProfileModal from "./EditProfileModal";
import { BookmarkFill, Star, ThreeDots, ArrowClockwise } from "react-bootstrap-icons";
import { BookCheck, BookOpen } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((currentState) => currentState.profile.user);
  const library = useSelector((currentState) => currentState.profile.savedBooks);

  const hasPublicBooks = Object.values(library ?? {}).some((book) => book.public);

  const [bookshelf, setBookshelf] = useState([]);
  const [loading, setLoading] = useState(hasPublicBooks);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  const stats = Object.values(library ?? {}).reduce(
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
        if (append) {
          setBookshelf((prev) => [...prev, ...response.data.content]);
        } else {
          setBookshelf(response.data.content);
        }
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
      })
      .catch((err) => {
        if (err.handled) return;
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  const getTotalReviews = () => {
    instance
      .get("/users/me")
      .then((response) => setTotalReviews(response.data.totalReviews))
      .catch((err) => {
        if (err.handled) return;
      });
  };

  const loadNextPage = () => {
    getUserBookshelf(currentPage + 1, true);
  };

  useEffect(() => {
    if (hasPublicBooks) {
      getUserBookshelf(0, false);
    }
    getTotalReviews();
  }, []);

  return (
    <>
      <Container fluid className="d-flex flex-column container-lg py-4 px-3 px-lg-4 px-xl-5  gap-3 gap-sm-2 gap-lg-3 gap-xl-5">
        {/* Profile header */}
        <Row className=" justify-content-center align-items-end pt-md-2 pt-lg-3 mb-lg-5 mb-xl-2 g-2 g-md-5 g-lg-4">
          <Col xs={12} className="d-md-none text-end">
            <Button className="bv-btn-edit" onClick={() => navigate("/me/edit")}>
              Edit profile
            </Button>
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
              <div className="d-none d-md-flex justify-content-between align-items-center pb-lg-4 pb-xl-2 mb-3 mb-xl-2 flex-grow-1">
                <h1 className="mb-0">{user.displayName}</h1>
                <Button className="bv-btn-edit" onClick={() => setShowEditModal(true)}>
                  Edit profile
                </Button>
              </div>
              <div>
                <Row className="g-3 g-md-2 g-lg-2 align-items-stretch align-items-md-center">
                  <DashboardCard statName="Saved" statValue={stats.saved} color="saved">
                    <BookmarkFill size={24} className="text-saved" />
                  </DashboardCard>
                  <DashboardCard statName="Read" statValue={stats.read} color="read">
                    <BookCheck size={24} className="text-read" />
                  </DashboardCard>
                  <DashboardCard statName="Reading" statValue={stats.reading} color="reading">
                    <BookOpen size={24} className="text-reading" />
                  </DashboardCard>
                  <DashboardCard statName="Reviewed" statValue={totalReviews} color="review">
                    <Star size={24} className="text-review" />
                  </DashboardCard>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        <Row className=" justify-content-center gap-sm-2 gap-md-3 mt-2 mt-sm-4 mt-md-5 mt-lg-0">
          {/* Profile bio */}
          {user.bio && (
            <Col xl={10}>
              <div>
                <h3 className="mb-3">Biography</h3>
                <p>{user.bio}</p>
              </div>
            </Col>
          )}
          {/* Profile bookshelf */}
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
                  <div className="bv-empty-state w-100">
                    <ArrowClockwise
                      size={40}
                      className="bv-empty-state__icon cursor-pointer"
                      onClick={() => {
                        setError(false);
                        setHasNext(false);
                        getUserBookshelf(0, false);
                      }}
                    />
                    <h5 className="bv-empty-state__title">Something went wrong</h5>
                    <p className="bv-empty-state__text">Something went wrong loading your bookshelf.</p>
                    <span
                      className="bv-empty-state__link cursor-pointer"
                      onClick={() => {
                        setError(false);
                        setHasNext(false);
                        getUserBookshelf(0, false);
                      }}
                    >
                      Try again
                    </span>
                  </div>
                ) : bookshelf.length === 0 ? (
                  <div className="bv-empty-state w-100">
                    <BookOpen size={40} className="bv-empty-state__icon" />
                    <h5 className="bv-empty-state__title">Your bookshelf is empty</h5>
                    <p className="bv-empty-state__text">To add a saved book to your bookshelf change its privacy to public</p>
                    <span className="bv-empty-state__link cursor-pointer" onClick={() => navigate("/library")}>
                      Go to your library
                    </span>
                  </div>
                ) : (
                  <>
                    {bookshelf.map((book) => (
                      <BookCard key={book.id} book={book.info} />
                    ))}
                    {hasNext && (
                      <Col xs={12} className="text-center">
                        <ThreeDots className="cursor-pointer text-faint" size={50} onClick={loadNextPage} />
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
