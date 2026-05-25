import { ListGroup, Row, Col, Button } from "react-bootstrap";
import { StarFill, Star } from "react-bootstrap-icons";

const Review = (props) => {
  const user = props.info.user;

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) =>
      i < props.info.rating ? <StarFill key={i} className="text-primary" /> : <Star key={i} className="text-secondary opacity-50" />,
    );
  };

  return (
    <>
      <ListGroup.Item
        className={props.isUserReview ? "py-3 border-top border-start-0 border-end-0 border-3 border-light position-relative" : "py-3 border-0 border-bottom"}
      >
        <Row className="align-items-center">
          <Col xs={2} className="d-flex justify-content-center">
            <img src={user.profilePictureURL} alt={user.username} className="review-avatar" />
          </Col>

          <Col xs={10} md={11}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <strong>{props.isUserReview ? "Your review" : user.displayName}</strong>
                </div>

                <div className="text-warning d-flex gap-1">{renderStars()}</div>

                <small className="text-muted">
                  {new Date(props.info.createdAt).toLocaleDateString("en-EN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </small>
              </div>

              <div className="fw-bold">{props.info.rating}/5</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="offset-2">
            <p className="mt-2 mb-0 fst-italic">"{props.info.comment}"</p>
          </Col>
        </Row>
        {props.isUserReview && (
          <Button
            className="position-absolute bottom-0 end-0 me-3 mb-3 px-3"
            size="sm"
            onClick={() => {
              props.setEditingReview(true);

              props.setUserReview({
                rating: props.info.rating,
                comment: props.info.comment,
              });
            }}
          >
            Edit
          </Button>
        )}
      </ListGroup.Item>
    </>
  );
};

export default Review;
