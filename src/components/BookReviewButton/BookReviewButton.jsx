import { useSelector } from "react-redux";
import { XCircle, CheckCircle } from "react-bootstrap-icons";

const BookReviewButton = () => {
  const userSavedBooks = useSelector((currentState) => currentState.profile.savedBooks);
  return (
    <>
      <XCircle size={50} />
    </>
  );
};

export default BookReviewButton;
