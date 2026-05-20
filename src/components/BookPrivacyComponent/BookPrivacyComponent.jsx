import { useDispatch, useSelector } from "react-redux";
import { LockFill, Unlock2 } from "react-bootstrap-icons";
import { setBookPrivacy } from "../../redux/actions";

const BookPrivacyComponent = (props) => {
  const dispatch = useDispatch();
  const savedBookIsPublic = useSelector((currentState) => currentState.profile.savedBooks?.[props.bookId].public);

  const makeBookPublic = () => {
    dispatch(setBookPrivacy(props.bookId, true));
  };

  const makeBookPrivate = () => {
    dispatch(setBookPrivacy(props.bookId, false));
  };

  return (
    <>
      {savedBookIsPublic && (
        <>
          <Unlock2 size={50} onClick={() => makeBookPrivate()} />
          <p className="mb-0">Public</p>
        </>
      )}
      {!savedBookIsPublic && (
        <>
          <LockFill size={50} onClick={() => makeBookPublic()} />
          <p className="mb-0">Private</p>
        </>
      )}
    </>
  );
};

export default BookPrivacyComponent;
