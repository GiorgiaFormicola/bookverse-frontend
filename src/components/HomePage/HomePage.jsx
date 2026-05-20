import { Container } from "react-bootstrap";
import HomePageSection from "../HomePageSection/HomePageSection";

const HomePage = () => {
  return (
    <>
      <div className="sticky-top bg-secondary" style={{ height: "4rem" }}>
        TOP NAVBAR
      </div>
      <Container fluid className="py-4 d-flex flex-column gap-4">
        <HomePageSection filter="TO_READ" title="Start reading"></HomePageSection>
        <HomePageSection filter="READING" title="Continue reading"></HomePageSection>
        <HomePageSection filter="READ" title="Leave a review"></HomePageSection>
      </Container>
      <div className=" sticky-bottom bg-secondary" style={{ height: "6rem" }}>
        BOTTOM NAVBAR
      </div>
    </>
  );
};

export default HomePage;
