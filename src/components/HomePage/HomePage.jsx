import { Container, Row, Col } from "react-bootstrap";
import HomePageSection from "../HomePageSection/HomePageSection";
import Dashboard from "../Dashboard";
import { useState } from "react";

const HomePage = () => {
  const [loadingSection1, setLoadingSection1] = useState(true);
  const [loadingSection2, setLoadingSection2] = useState(true);
  const [loadingSection3, setLoadingSection3] = useState(true);

  const isLoading = loadingSection1 || loadingSection2 || loadingSection3;

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
        <HomePageSection filter="TO_READ" title="Start reading" loading={isLoading} setLoading={setLoadingSection1}></HomePageSection>
        <HomePageSection filter="READING" title="Continue reading" loading={isLoading} setLoading={setLoadingSection2}></HomePageSection>
        <HomePageSection filter="READ" title="Leave a review" loading={isLoading} setLoading={setLoadingSection3}></HomePageSection>
      </Container>
    </>
  );
};

export default HomePage;
