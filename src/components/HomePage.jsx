import { Container, Row, Col } from "react-bootstrap";
import HomePageSection from "./HomePageSection";
import Dashboard from "./Dashboard";
import { useState } from "react";
import { Book } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [loadingSection1, setLoadingSection1] = useState(true);
  const [loadingSection2, setLoadingSection2] = useState(true);
  const [loadingSection3, setLoadingSection3] = useState(true);
  const [emptySection1, setEmptySection1] = useState(false);
  const [emptySection2, setEmptySection2] = useState(false);
  const [emptySection3, setEmptySection3] = useState(false);

  const isLoading = loadingSection1 || loadingSection2 || loadingSection3;
  const allEmpty = !isLoading && emptySection1 && emptySection2 && emptySection3;

  return (
    <>
      <Container fluid className="d-flex flex-column container-lg py-4 px-3 px-lg-4 gap-5 gap-lg-3">
        <div className="my-2 mt-lg-2">
          <Row className="mb-4">
            <Col>
              <h1 className="mb-0">Your Dashboard</h1>
            </Col>
          </Row>
          <Row className="g-3 g-sm-4 g-lg-3 g-xl-4 mb-lg-3">
            <Dashboard />
          </Row>
        </div>
        <HomePageSection
          filter="TO_READ"
          title="Start reading"
          loading={isLoading}
          setLoading={setLoadingSection1}
          onEmpty={() => setEmptySection1(true)}
        ></HomePageSection>
        <HomePageSection
          filter="READING"
          title="Continue reading"
          loading={isLoading}
          setLoading={setLoadingSection2}
          onEmpty={() => setEmptySection2(true)}
        ></HomePageSection>
        <HomePageSection
          filter="READ"
          reviewed={false}
          title="Leave a review"
          loading={isLoading}
          setLoading={setLoadingSection3}
          onEmpty={() => setEmptySection3(true)}
        ></HomePageSection>
        {allEmpty && (
          <div className="bv-empty-state">
            <Book size={40} className="bv-empty-state__icon" />
            <h5 className="bv-empty-state__title">Start your adventure</h5>
            <p className="bv-empty-state__text">Search and discover books to add to your library</p>
            <Link to="/search" className="bv-empty-state__link">
              Go to Search page
            </Link>
          </div>
        )}
      </Container>
    </>
  );
};

export default HomePage;
