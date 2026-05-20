import { useSelector } from "react-redux";
import { LockFill, Unlock2 } from "react-bootstrap-icons";

const BookPrivacyButton = () => {
  const userSavedBooks = useSelector((currentState) => currentState.profile.savedBooks);
  return (
    <>
      <LockFill size={50} />
    </>
  );
};

export default BookPrivacyButton;
