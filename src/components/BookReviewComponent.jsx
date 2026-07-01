import { Button } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

const BookReviewComponent = ({ isReviewed, handleReviewClick, disabled, active }) => {
  const isPink = isReviewed || active;
  return (
    <Button
      variant="link"
      disabled={disabled}
      className={`bv-book-review ${isPink ? "bv-book-review--done" : "bv-book-review--add"} d-flex align-items-center py-3 px-5 gap-lg-1 px-lg-3  fs-6 rounded-3 w-100`}
      onClick={handleReviewClick}
    >
      {isReviewed ? <StarFill size={25} /> : <Star size={25} />}
      <p className="mb-0 flex-grow-1 text-center">{isReviewed ? "Edit your review" : "Add your review"}</p>
    </Button>
  );
};

export default BookReviewComponent;
