import { Pen, PenFill } from "react-bootstrap-icons";

const BookReviewComponent = (props) => {
  return (
    <>
      {props.isReviewed && (
        <>
          <PenFill size={50} onClick={props.onClick} />
          <p className="mb-0">Modify your review</p>
        </>
      )}

      {!props.isReviewed && (
        <>
          <Pen size={50} onClick={props.onClick} />
          <p className="mb-0">Add your review</p>
        </>
      )}
    </>
  );
};

export default BookReviewComponent;
