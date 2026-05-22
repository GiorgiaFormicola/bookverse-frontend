import { useDispatch, useSelector } from "react-redux";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { addBookToLibrary, removeBookFromLibrary } from "../../redux/actions";
import { useLocation } from "react-router-dom";

const BookSaveComponent = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
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

  return (
    <>
      {location.pathname === "/books/" + props.book.googleId && (
        <>
          {isSaved && (
            <>
              <SuitHeartFill size={50} onClick={() => removeBook()} />
              <p className="mb-0">Unsave from library</p>
            </>
          )}
          {!isSaved && (
            <>
              <SuitHeart size={50} onClick={() => addBook()} />
              <p className="mb-0">Save to your library</p>
            </>
          )}
        </>
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
