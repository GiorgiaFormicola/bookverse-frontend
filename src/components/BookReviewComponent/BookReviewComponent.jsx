import { useSelector } from "react-redux";
import { XCircle, CheckCircle, Pen, PenFill } from "react-bootstrap-icons";

const BookReviewComponent = () => {
  const userSavedBooks = useSelector((currentState) => currentState.profile.savedBooks);
  return (
    <>
      {/* {<Pen size={50} />
      <p className="mb-0">Add your review</p>
      <PenFill size={50} />
      <p className="mb-0">Modify your review</p>} */}
    </>
  );
};

export default BookReviewComponent;
