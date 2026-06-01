import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import { updateBookStatus } from "../redux/actions";
import { Book, BookOpen, BookCheck } from "lucide-react";

const BookStatusComponent = ({ bookId }) => {
  const dispatch = useDispatch();
  const savedBookStatus = useSelector((currentState) => currentState.profile.savedBooks?.[bookId].status);

  const updateStatus = (newStatus) => {
    dispatch(updateBookStatus(bookId, newStatus));
  };

  return (
    <div className="d-flex align-items-center px-2 px-sm-4 py-1 px-lg-3 py-lg-2 rounded-3 gap-2 bg-transparent w-100 flex-grow-1">
      {savedBookStatus === "TO_READ" && <Book size={25} className="text-toread" />}
      {savedBookStatus === "READING" && <BookOpen size={25} className="text-reading" />}
      {savedBookStatus === "READ" && <BookCheck size={25} className="text-read" />}
      <Form.Select value={savedBookStatus} onChange={(e) => updateStatus(e.target.value)}>
        <option value="TO_READ">To read...</option>
        <option value="READING">Now reading...</option>
        <option value="READ">Already read!</option>
      </Form.Select>
    </div>
  );
};

export default BookStatusComponent;
