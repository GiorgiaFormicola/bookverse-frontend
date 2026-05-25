import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { instance } from "../../config/api";
import BookCard from "../BookCard/BookCard";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const profile = useSelector((currentState) => currentState.profile);
  const user = profile.user;
  const userBooks = profile.savedBooks;
  const [loading, setLoading] = useState(true);
  const [publicBooks, setPublicBooks] = useState([]);
  const navigate = useNavigate();

  const getUserPublicBooks = () => {
    instance
      .get(`/me/books?isPublic=true`)
      .then((response) => {
        console.log(response.data.content);
        setPublicBooks(response.data.content);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getUserPublicBooks();
  }, []);

  return (
    <Container>
      <Row className="align-items-center position-relative">
        {user && userBooks && (
          <>
            <Col xs={4}>
              <img src={user.profilePictureURL} alt={user.username} className=" img-fluid rounded-circle" />
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
      </Row>
    </Container>
  );
};

export default ProfilePage;
