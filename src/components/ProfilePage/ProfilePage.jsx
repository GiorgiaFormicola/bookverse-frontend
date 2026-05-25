import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import BookCard from "../BookCard/BookCard";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-bootstrap-icons";

const ProfilePage = () => {
  const profile = useSelector((currentState) => currentState.profile);
  const user = profile.user;
  const userBooks = profile.savedBooks;
  const [loading, setLoading] = useState(true);
  const [publicBooks, setPublicBooks] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  const getUserPublicBooks = (pageNumber, append) => {
    instance
      .get(`/me/books?isPublic=true&page=${pageNumber}&size=20`)
      .then((response) => {
        console.log(response.data.content);
        if (append) {
          setPublicBooks((prev) => [...prev, ...response.data.content]);
        } else {
          setPublicBooks(response.data.content);
        }
        setCurrentPage(response.data.number);
        setHasNext(!response.data.last);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const loadNextPage = () => {
    const nextPage = currentPage + 1;
    getUserPublicBooks(nextPage, true);
  };

  useEffect(() => {
    getUserPublicBooks(currentPage, false);
  }, []);

  return (
    <Container>
      <Row className="align-items-center position-relative">
        {user && userBooks && (
          <>
            <Col xs={4}>
              <img src={user.profilePictureURL} alt={user.username} className="avatar" />
            </Col>
            <Col xs={8}>
              <div className="d-flex gap-3">
                <h1 className="mb-0">{user.displayName}</h1>
                <Button onClick={() => navigate("/me/edit")}>Edit profile</Button>
              </div>
              <p className="mb-0">{Object.keys(userBooks).length} books saved</p>
              <p className="mb-0">{Object.values(userBooks).filter((book) => book.status === "READ").length} books read</p>
              <p className="mb-0">X books reviewed</p>
            </Col>
            {user.bio && <Col xs={12}>{user.bio}</Col>}
          </>
        )}
      </Row>
      <Row className="mt-3">
        <Col>
          <h1>My Bookshelf</h1>
        </Col>
      </Row>
      <Row className="justify-content-center g-3">
        {!loading &&
          publicBooks.map((book) => {
            return <BookCard key={book.id} book={book.info} />;
          })}
        {hasNext && (
          <Col xs={12} className="text-center">
            <ThreeDots size={50} style={{ cursor: "pointer" }} onClick={() => loadNextPage()}></ThreeDots>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ProfilePage;
