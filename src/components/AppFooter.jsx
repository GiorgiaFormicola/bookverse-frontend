import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Github, TwitterX, Instagram, Heart, Book } from "react-bootstrap-icons";
import { Home, Library, Search } from "lucide-react";

const navLinkClass = (path) => `nav-link d-flex align-items-center gap-2${location.pathname === path ? " active" : ""}`;

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* BOTTOM NAV MOBILE */}
      <Navbar bg="dark" variant="dark" sticky="bottom" className="shadow-sm d-lg-none">
        <Container fluid className="px-3 pb-4 justify-content-center">
          <Nav className="w-100 justify-content-evenly">
            <Link to="/" className={navLinkClass("/")}>
              <Home size={40} />
              <span className="small">Home</span>
            </Link>

            <Link to="/library" className={navLinkClass("/library")}>
              <Library size={40} />
              <span className="small">My Library</span>
            </Link>

            <Link to="/search" className={navLinkClass("/search")}>
              <Search size={40} />
              <span className="small">Search</span>
            </Link>
          </Nav>
        </Container>
      </Navbar>
      {/* BOTTOM NAV MOBILE */}
      {/* DESKTOP FOOTER */}
      <footer className="bg-dark text-white mt-auto d-none d-lg-block border-top border-secondary">
        <Container className="py-4">
          <Row className="row align-items-center gy-3">
            <Col lg={6}>
              <div className="ms-2">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Book size={22} />
                  <span className="display-font h5 mb-0">BookVerse</span>
                </div>
                <p className="text-muted small mb-0">Where every story finds its shelf.</p>
              </div>
            </Col>

            <Col lg={6} className="d-flex flex-column align-items-lg-end gap-2">
              <div className="d-flex gap-3">
                <a href="#" className="text-muted">
                  <Github size={18} />
                </a>
                <a href="#" className="text-muted">
                  <TwitterX size={18} />
                </a>
                <a href="#" className="text-muted">
                  <Instagram size={18} />
                </a>
              </div>
              <p className="text-muted small mb-0">
                © {currentYear} BookVerse — Made with <Heart size={12} className="text-danger mx-1" fill="currentColor" />
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
      {/* DESKTOP FOOTER */}
    </>
  );
};

export default AppFooter;
