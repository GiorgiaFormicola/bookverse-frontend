import { ListGroup, Button } from "react-bootstrap";
import { StarFill, Star } from "react-bootstrap-icons";

const Review = ({ review, isUserReview, handleReviewClick }) => {
  const user = review.user;

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) =>
      i < review.rating ? <StarFill key={i} className="text-accent" /> : <Star key={i} className="text-faint opacity-50" />,
    );
  };

  return (
    <ListGroup.Item className={`bv-review ${isUserReview ? "bv-review--own" : ""}`}>
      <div className="d-flex align-items-center gap-2 mb-2">
        <img src={user.profilePictureURL} alt={user.username} className="review-avatar" />
        <div className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            <strong className="bv-review__name">{isUserReview ? "Your review" : user.displayName}</strong>
            <small className="bv-review__date">
              {new Date(review.createdAt).toLocaleDateString("en-EN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex gap-1">{renderStars()}</div>
            <small className="fw-bold text-faint">{review.rating}/5</small>
          </div>
        </div>
      </div>
      <p className="bv-review__comment mb-0">"{review.comment}"</p>
      {isUserReview && (
        <Button className="bv-btn-confirm position-absolute bottom-0 end-0 me-2 mb-3 px-3" size="sm" onClick={handleReviewClick}>
          Edit
        </Button>
      )}
    </ListGroup.Item>
  );
};

export default Review;
