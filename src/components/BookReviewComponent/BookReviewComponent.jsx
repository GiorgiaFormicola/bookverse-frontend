import { Button } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

const BookReviewComponent = ({ isReviewed, handleReviewClick }) => {
  return (
    <Button
      type="button"
      className="d-flex align-items-center px-2 px-sm-4 py-lg-2 px-lg-3 rounded-3 gap-1 w-100 bg-dark border-dark flex-grow-1"
      onClick={handleReviewClick}
    >
      {isReviewed ? <StarFill size={28} className="d-lg-none" /> : <Star size={28} className="d-lg-none" />}
      {/*  {isReviewed ? <StarFill size={30} className="d-none d-lg-block" /> : <Star size={30} className="d-none d-lg-block" />} */}
      <p className="mb-0 flex-grow-1">{isReviewed ? "Update your review" : "Add your review"}</p>
    </Button>
  );
};

export default BookReviewComponent;
