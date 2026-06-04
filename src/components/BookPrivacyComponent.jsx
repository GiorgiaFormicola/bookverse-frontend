import { useDispatch, useSelector } from "react-redux";
import { setBookPrivacy } from "../redux/actions";
import { Form, Spinner } from "react-bootstrap";
import { LockFill } from "react-bootstrap-icons";
import { Globe } from "lucide-react";
import { useState } from "react";

const BookPrivacyComponent = ({ bookId }) => {
  const dispatch = useDispatch();
  const isPublic = useSelector((currentState) => currentState.profile.savedBooks?.[bookId].public);
  const [loading, setLoading] = useState(false);

  const updatePrivacy = async (newPrivacy) => {
    setLoading(true);
    try {
      await dispatch(setBookPrivacy(bookId, newPrivacy === "true"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center py-3 justify-content-center px-4 rounded-3 gap-3 w-100 bv-book-control">
      {loading ? (
        <Spinner animation="border" size="sm" className="text-accent mx-1" />
      ) : isPublic ? (
        <Globe size={25} className="text-reading" />
      ) : (
        <LockFill size={25} className="text-muted" />
      )}
      <Form.Select size="md" disabled={loading} className="py-3 py-lg-2 py-xxl-3" value={String(isPublic)} onChange={(e) => updatePrivacy(e.target.value)}>
        <option value="true">Public</option>
        <option value="false">Private</option>
      </Form.Select>
    </div>
  );
};

export default BookPrivacyComponent;
