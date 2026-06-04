import { Container, Row, Col } from "react-bootstrap";
import HomePageSection from "./HomePageSection";
import Dashboard from "./Dashboard";
import { useState } from "react";
import { Book } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const HomePage = () => {
  const savedBooks = useSelector((currentState) => currentState.profile?.savedBooks);
  const hasBooks = savedBooks && Object.keys(savedBooks).length > 0;
  const hasToRead = savedBooks && Object.values(savedBooks).some((b) => b.status === "TO_READ");
  const hasReading = savedBooks && Object.values(savedBooks).some((b) => b.status === "READING");
  const hasRead = savedBooks && Object.values(savedBooks).some((b) => b.status === "READ");
  const [loadingSection1, setLoadingSection1] = useState(hasToRead);
  const [loadingSection2, setLoadingSection2] = useState(hasReading);
  const [loadingSection3, setLoadingSection3] = useState(hasRead);

  const isLoading = loadingSection1 || loadingSection2 || loadingSection3;

  return (
    <>
      <Container fluid className="d-flex flex-column container-lg pt-4 px-3 px-lg-4 gap-lg-3 min-vh-100">
        {/* Dashboard */}
        <div>
          <Row className="mt-1">
            <Col>
              <h1 className="mb-4">Your Dashboard</h1>
            </Col>
          </Row>
          <Row className="g-3 g-sm-4 g-lg-3 g-xl-4 mb-5">
            <Dashboard />
          </Row>
        </div>
        {!hasBooks ? (
          <div className="bv-empty-state">
            <Book size={40} className="bv-empty-state__icon" />
            <h5 className="bv-empty-state__title">Start your adventure</h5>
            <p className="bv-empty-state__text">Search and discover books to add to your library</p>
            <Link to="/search" className="bv-empty-state__link">
              Go to Search page
            </Link>
          </div>
        ) : (
          <>
            {hasToRead && <HomePageSection filter="TO_READ" title="Start reading" loading={isLoading} setLoading={setLoadingSection1}></HomePageSection>}
            {hasReading && <HomePageSection filter="READING" title="Continue reading" loading={isLoading} setLoading={setLoadingSection2}></HomePageSection>}
            {hasRead && (
              <HomePageSection filter="READ" reviewed={false} title="Leave a review" loading={isLoading} setLoading={setLoadingSection3}></HomePageSection>
            )}
          </>
        )}
        {/* Sections */}
      </Container>
    </>
  );
};

export default HomePage;
