import { useSelector, useDispatch } from "react-redux";
import { Book, BookHalf, BookFill } from "react-bootstrap-icons";
import { Form } from "react-bootstrap";
import { updateBookStatus } from "../../redux/actions";

const BookStatusComponent = ({ bookId }) => {
  const dispatch = useDispatch();
  const savedBookStatus = useSelector((currentState) => currentState.profile.savedBooks?.[bookId].status);
  const statusLabels = {
    TO_READ: "To read...",
    READING: "On reading...",
    READ: "Already read!",
  };

  const updateStatus = (newStatus) => {
    dispatch(updateBookStatus(bookId, newStatus));
  };

  return (
    <>
      <div className="d-flex align-items-center px-2 px-sm-4 py-1 px-lg-3 py-lg-2 rounded-3 gap-2 bg-transparent w-100 flex-grow-1">
        {savedBookStatus === "TO_READ" && <Book size={38} className="d-lg-none" />}
        {savedBookStatus === "READING" && <BookHalf size={38} className="d-lg-none" />}
        {savedBookStatus === "READ" && <BookFill size={38} className="d-lg-none" />}
        {/*  {savedBookStatus === "TO_READ" && <Book size={34} className="d-none d-lg-block" />}
        {savedBookStatus === "READING" && <BookHalf size={34} className="d-none d-lg-block" />}
        {savedBookStatus === "READ" && <BookFill size={34} className="d-none d-lg-block" />} */}
        <Form.Select value={savedBookStatus} onChange={(e) => updateStatus(e.target.value)}>
          <option value="TO_READ">{statusLabels["TO_READ"]}</option>
          <option value="READING">{statusLabels["READING"]}</option>
          <option value="READ">{statusLabels["READ"]}</option>
        </Form.Select>
      </div>
    </>
  );
};

export default BookStatusComponent;
