import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { addBookToLibrary, removeBookFromLibrary } from "../redux/actions";
import { useLocation } from "react-router-dom";

const BookSaveComponent = ({ book }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const savedBook = useSelector((currentState) => currentState.profile.savedBooks?.[book.googleId]);
  const isSaved = Boolean(savedBook);

  const removeBook = () => {
    dispatch(removeBookFromLibrary(book.googleId));
  };

  const addBook = () => {
    dispatch(addBookToLibrary(book));
  };

  const handleClick = () => {
    if (isSaved) {
      removeBook();
    } else {
      addBook();
    }
  };

  return (
    <>
      {location.pathname === "/books/" + book.googleId && (
        <Button
          type="button"
          className={`bv-book-action bv-book-action--save ${isSaved ? "saved" : ""} d-flex align-items-center px-3 px-sm-4 p-lg-3 gap-0 w-100 flex-grow-1`}
          onClick={handleClick}
        >
          {isSaved ? <SuitHeartFill size={20} /> : <SuitHeart size={20} />}
          <p className="mb-0 flex-grow-1 text-center">{isSaved ? "Remove from library" : "Add to library"}</p>
        </Button>
      )}

      {location.pathname === "/search" && (
        <>
          {isSaved && (
            <>
              <SuitHeartFill
                className="text-saved"
                size={30}
                onClick={(e) => {
                  e.stopPropagation();
                  removeBook();
                }}
              />
            </>
          )}
          {!isSaved && (
            <>
              <SuitHeart
                className="text-muted"
                size={30}
                onClick={(e) => {
                  e.stopPropagation();
                  addBook();
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default BookSaveComponent;
