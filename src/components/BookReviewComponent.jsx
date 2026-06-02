import { Button } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

const BookReviewComponent = ({ isReviewed, handleReviewClick }) => {
  return (
    <Button
      variant="link"
      className={`bv-book-review ${isReviewed ? "bv-book-review--done" : "bv-book-review--add"} d-flex align-items-center px-3 px-sm-4 gap-0 p-lg-3  w-100 flex-grow-1`}
      onClick={handleReviewClick}
    >
      {isReviewed ? <StarFill size={20} /> : <Star size={20} />}
      <p className="mb-0 flex-grow-1 text-center">{isReviewed ? "Edit your review" : "Add your review"}</p>
    </Button>
  );
};

export default BookReviewComponent;
