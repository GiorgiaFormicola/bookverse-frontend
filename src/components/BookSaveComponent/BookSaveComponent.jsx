import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { addBookToLibrary, removeBookFromLibrary } from "../../redux/actions";
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
          className="d-flex align-items-center px-2 px-sm-4 py-lg-2 px-lg-3  rounded-3 gap-1 w-100 flex-grow-1"
          onClick={() => handleClick()}
        >
          {isSaved ? <SuitHeartFill size={34} className="d-lg-none" /> : <SuitHeart size={34} className="d-lg-none" />}
          {isSaved ? <SuitHeartFill size={28} className="d-none d-lg-block" /> : <SuitHeart size={28} className="d-none d-lg-block" />}
          <p className="mb-0 flex-grow-1" style={{ letterSpacing: "-0.025em" }}>
            {isSaved ? "Remove from library" : "Add to library"}
          </p>
        </Button>
      )}

      {location.pathname === "/search" && (
        <>
          {isSaved && (
            <>
              <SuitHeartFill
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

      {/* {location.pathname === "/library" && (
        <>
          {isSaved && (
            <>
              <SuitHeartFill
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
              <SuitHeart size={25} onClick={() => addBook()} />
            </>
          )}
        </>
      )} */}
    </>
  );
};

export default BookSaveComponent;
