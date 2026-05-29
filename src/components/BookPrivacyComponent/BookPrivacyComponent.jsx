import { useDispatch, useSelector } from "react-redux";
import { setBookPrivacy } from "../../redux/actions";
import { Form } from "react-bootstrap";
import { LockFill } from "react-bootstrap-icons";
import { Globe } from "lucide-react";

const BookPrivacyComponent = ({ bookId }) => {
  const dispatch = useDispatch();
  const isPublic = useSelector((currentState) => currentState.profile.savedBooks?.[bookId].public);

  const makeBookPrivate = () => {
    dispatch(setBookPrivacy(bookId, false));
  };

  const makeBookPublic = () => {
    dispatch(setBookPrivacy(bookId, true));
  };

  const updatePrivacy = (newPrivacy) => {
    if (newPrivacy === "false") {
      makeBookPrivate();
    } else {
      makeBookPublic();
    }
  };

  return (
    <div className="d-flex align-items-center px-2 px-sm-4 py-1  px-lg-3 py-lg-2 rounded-3 gap-2 bg-transparent w-100 flex-grow-1">
      {isPublic ? <Globe size={38} className="" /> : <LockFill size={38} className="" />}
      <Form.Select value={String(isPublic)} onChange={(e) => updatePrivacy(e.target.value)}>
        <option value="true">Public book</option>
        <option value="false">Private book</option>
      </Form.Select>
    </div>
  );
};

export default BookPrivacyComponent;
