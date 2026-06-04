import { useSelector, useDispatch } from "react-redux";
import { Form, Spinner } from "react-bootstrap";
import { updateBookStatus } from "../redux/actions";
import { Book, BookOpen, BookCheck } from "lucide-react";
import { useState } from "react";

const BookStatusComponent = ({ bookId }) => {
  const dispatch = useDispatch();
  const savedBookStatus = useSelector((currentState) => currentState.profile.savedBooks?.[bookId].status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await dispatch(updateBookStatus(bookId, newStatus));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center py-3 justify-content-center px-4 rounded-3 gap-3 w-100 bv-book-control">
      {loading ? (
        <Spinner animation="border" size="sm" className="text-accent mx-1" />
      ) : (
        <>
          {savedBookStatus === "TO_READ" && <Book size={30} className="text-toread" />}
          {savedBookStatus === "READING" && <BookOpen size={25} className="text-reading" />}
          {savedBookStatus === "READ" && <BookCheck size={25} className="text-read" />}
        </>
      )}
      <Form.Select className="py-3 py-lg-2 py-xxl-3" size="md" disabled={loading} value={savedBookStatus} onChange={(e) => updateStatus(e.target.value)}>
        <option value="TO_READ">To read...</option>
        <option value="READING">Now reading...</option>
        <option value="READ">Already read!</option>
      </Form.Select>
    </div>
  );
};

export default BookStatusComponent;
