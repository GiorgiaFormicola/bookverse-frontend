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
          variant="link"
          className={`bv-book-save ${isSaved ? "bv-book-save--remove" : "bv-book-save--add"} d-flex align-items-center gap-lg-1 py-3 px-5 px-lg-3 fs-6 rounded-3 w-100`}
          onClick={handleClick}
        >
          {isSaved ? <SuitHeartFill size={25} /> : <SuitHeart size={25} />}
          <p className="mb-0 flex-grow-1 text-center">{isSaved ? "Delete from library" : "Add to library"}</p>
        </Button>
      )}

      {location.pathname === "/search" && (
        <>
          {isSaved && (
            <>
              <SuitHeartFill
                className="text-saved"
                size={25}
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
                size={25}
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
