import { Container, Row, Col } from "react-bootstrap";
import HomePageSection from "../HomePageSection/HomePageSection";
import Dashboard from "../Dashboard";
import { useState } from "react";
import { BookHalf } from "react-bootstrap-icons";
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
      <Container fluid className="d-flex flex-column container-lg py-4 px-3 px-lg-4 gap-4 gap-lg-3">
        <div className="mb-2 mt-lg-2">
          <Row className="mb-3 mb-lg-4">
            <Col>
              <h1 className="mb-0">Your Dashboard</h1>
            </Col>
          </Row>
          {/* DASHBOARDS */}
          <Row className="g-2 d-sm-none">
            <Dashboard size="xs" />
          </Row>
          <Row className="g-3 d-none d-sm-flex d-lg-none">
            <Dashboard size="sm" />
          </Row>
          <Row className="g-3 mb-3 d-none d-lg-flex">
            <Dashboard size="lg" />
          </Row>
          {/* DASHBOARDS */}
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
          title="Leave a review"
          loading={isLoading}
          setLoading={setLoadingSection3}
          onEmpty={() => setEmptySection3(true)}
        ></HomePageSection>
        {allEmpty && (
          <>
            <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 gap-3">
              <BookHalf size={60} className="opacity-50" />
              <h4 className="mb-0">Start your adventure</h4>

              <p className="mb-0">Search and discover books to add to your library</p>
              <div className="d-flex flex-column align-items-center gap-2">
                <Link to="/search" className="fw-bold text-light opacity-75 text-decoration-none">
                  Go to Search page
                </Link>
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default HomePage;
