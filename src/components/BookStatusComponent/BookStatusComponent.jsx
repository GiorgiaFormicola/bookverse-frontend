import { useSelector, useDispatch } from "react-redux";
import { Book, BookHalf, BookFill } from "react-bootstrap-icons";
import { Form } from "react-bootstrap";
import { updateBookStatus } from "../../redux/actions";

const BookStatusComponent = (props) => {
  const dispatch = useDispatch();
  const savedBookStatus = useSelector((currentState) => currentState.profile.savedBooks?.[props.bookId].status);
  const statusLabels = {
    TO_READ: "To read...",
    READING: "On reading...",
    READ: "Already read!",
  };

  const updateStatus = (newStatus) => {
    dispatch(updateBookStatus(props.bookId, newStatus));
  };

  return (
    <>
      {savedBookStatus === "TO_READ" && <Book size={50} />}
      {savedBookStatus === "READING" && <BookHalf size={50} />}
      {savedBookStatus === "READ" && <BookFill size={50} />}
      <Form.Select size="sm" value={savedBookStatus} onChange={(e) => updateStatus(e.target.value)}>
        <option value="TO_READ">{statusLabels["TO_READ"]}</option>
        <option value="READING">{statusLabels["READING"]}</option>
        <option value="READ">{statusLabels["READ"]}</option>
      </Form.Select>
    </>
  );
};

export default BookStatusComponent;
