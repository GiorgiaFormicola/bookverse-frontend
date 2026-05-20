import { useSelector } from "react-redux";
import { Book, BookHalf, BookFill } from "react-bootstrap-icons";

const BookStatusButton = () => {
  const userSavedBooks = useSelector((currentState) => currentState.profile.savedBooks);
  return (
    <>
      <Book size={50} />
    </>
  );
};

export default BookStatusButton;
