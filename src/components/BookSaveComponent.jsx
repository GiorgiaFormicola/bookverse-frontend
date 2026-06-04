import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner } from "react-bootstrap";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { addBookToLibrary, removeBookFromLibrary } from "../redux/actions";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const BookSaveComponent = ({ book }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const savedBook = useSelector((currentState) => currentState.profile.savedBooks?.[book.googleId]);
  const isSaved = Boolean(savedBook);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await dispatch(removeBookFromLibrary(book.googleId));
      } else {
        await dispatch(addBookToLibrary(book));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {location.pathname === "/books/" + book.googleId && (
        <Button
          variant="link"
          className={`bv-book-save ${isSaved ? "bv-book-save--remove" : "bv-book-save--add"} d-flex align-items-center justify-content-center gap-lg-1 py-3 px-5 px-lg-3 fs-6 rounded-3 w-100`}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <div className="" style={{ paddingBlock: "0.005em" }}>
              <Spinner animation="border" size="sm" className="text-white" />
            </div>
          ) : (
            <>
              {isSaved ? <SuitHeartFill size={25} /> : <SuitHeart size={25} />}
              <p className="mb-0 flex-grow-1 text-center">{isSaved ? "Delete from library" : "Add to library"}</p>
            </>
          )}
        </Button>
      )}

      {location.pathname === "/search" && (
        <>
          {loading ? (
            <Spinner animation="border" size="sm" className="text-saved" onClick={(e) => e.stopPropagation()} />
          ) : isSaved ? (
            <SuitHeartFill
              className="text-saved cursor-pointer"
              size={25}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            />
          ) : (
            <SuitHeart
              className="text-muted cursor-pointer"
              size={25}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default BookSaveComponent;
