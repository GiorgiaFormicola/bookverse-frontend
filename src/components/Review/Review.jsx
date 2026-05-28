import { ListGroup, Button } from "react-bootstrap";
import { StarFill, Star } from "react-bootstrap-icons";

const Review = ({ review, isUserReview, handleReviewClick }) => {
  const user = review.user;

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) =>
      i < review.rating ? <StarFill key={i} className="text-primary" /> : <Star key={i} className="text-secondary opacity-50" />,
    );
  };

  return (
    <>
      {/* <ListGroup.Item
        className={
          isUserReview
            ? "py-3 border-top border-start-0 border-end-0 border-bottom-0 border-2 border-light border-opacity-25 position-relative"
            : "py-3 border-0 border-bottom"
        }
      >
        <Row className="align-items-center">
          <Col xs={2} lg={1} className="d-flex justify-content-center">
            <img src={user.profilePictureURL} alt={user.username} className="review-avatar" />
          </Col>

          <Col xs={10} md={11} lg={11}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <strong>{isUserReview ? "Your review" : user.displayName}</strong>
                </div>

                <div className="text-warning d-flex gap-1">{renderStars()}</div>

                <small className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString("en-EN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </small>
              </div>

              <div className="fw-bold">{review.rating}/5</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="offset-2 offset-lg-1">
            <p className="mt-2 mb-0 fst-italic">"{review.comment}"</p>
          </Col>
        </Row>
        {isUserReview && (
          <Button
            className="position-absolute bottom-0 end-0 me-3 mb-3 px-3"
            size="sm"
            onClick={() => {
              setEditingReview(true);

              setUserReview({
                rating: review.rating,
                comment: review.comment,
              });
            }}
          >
            Edit
          </Button>
        )}
      </ListGroup.Item> */}
      <ListGroup.Item
        className={
          isUserReview
            ? "px-2 py-3 border-top border-start-0 border-end-0 border-bottom-0 border-2 border-light border-opacity-50 position-relative"
            : "px-2 py-3"
        }
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <img src={user.profilePictureURL} alt={user.username} className="rounded-circle" width={40} height={40} />
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between">
              <strong>{isUserReview ? "Your review" : user.displayName}</strong>
              <small className="text-muted">
                {new Date(review.createdAt).toLocaleDateString("en-EN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="text-warning d-flex gap-1">{renderStars()}</div>
              <small className="fw-bold">{review.rating}/5</small>
            </div>
          </div>
        </div>

        <p className="mb-0 fst-italic">"{review.comment}"</p>

        {isUserReview && (
          <Button className="position-absolute bottom-0 end-0 me-1 me-lg-2 mb-3 px-4 px-lg-4" size="md" onClick={handleReviewClick}>
            Edit
          </Button>
        )}
      </ListGroup.Item>
    </>
  );
};

export default Review;
