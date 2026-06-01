import { Button } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

const BookReviewComponent = ({ isReviewed, handleReviewClick }) => {
  return (
    <Button
      type="button"
      className={`bv-book-action bv-book-action--review ${isReviewed ? "reviewed" : ""} d-flex align-items-center px-2 px-sm-4 gap-0 py-lg-2 px-lg-3  w-100 flex-grow-1`}
      onClick={handleReviewClick}
    >
      {isReviewed ? <StarFill size={20} /> : <Star size={20} />}
      <p className="mb-0 flex-grow-1 text-center">{isReviewed ? "Update your review" : "Add your review"}</p>
    </Button>
  );
};

export default BookReviewComponent;
