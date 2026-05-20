import { useDispatch, useSelector } from "react-redux";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { addBookToLibrary, removeBookFromLibrary } from "../../redux/actions";

const BookSaveButton = (props) => {
  const dispatch = useDispatch();
  const savedBook = useSelector((currentState) => currentState.profile.savedBooks?.[props.book.googleId]);
  const isSaved = Boolean(savedBook);

  const removeBook = () => {
    dispatch(removeBookFromLibrary(props.book.googleId));
    console.log("libro rimosso");
  };

  const addBook = () => {
    dispatch(addBookToLibrary(props.book));
    console.log("libro aggiunto");
  };

  return <>{isSaved ? <SuitHeartFill size={50} onClick={() => removeBook()} /> : <SuitHeart size={50} onClick={() => addBook()} />}</>;
};

export default BookSaveButton;
