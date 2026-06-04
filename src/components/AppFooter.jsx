import { Container, Row, Col } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Github, TwitterX, Instagram, Heart, Book } from "react-bootstrap-icons";
import { Home, Library, Search } from "lucide-react";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const navLinkClass = (path) => `bv-bottom-nav__link d-flex flex-column align-items-center gap-1${location.pathname === path ? " active" : ""}`;

  return (
    <>
      {/* Bottom nav mobile */}
      <Nav className="bv-bottom-nav d-lg-none pt-3 pb-4">
        <Link to="/" className={navLinkClass("/")}>
          <Home size={22} strokeWidth={2} />
          <span>Home</span>
        </Link>
        <Link to="/library" className={navLinkClass("/library")}>
          <Library size={22} strokeWidth={2} />
          <span>Library</span>
        </Link>
        <Link to="/search" className={navLinkClass("/search")}>
          <Search size={22} strokeWidth={2} />
          <span>Search</span>
        </Link>
      </Nav>

      {/* Desktop footer */}
      <footer className="bv-footer d-none d-lg-block">
        <Container fluid className="p-4">
          <Row className="align-items-center g-3 px-1">
            <Col lg={6}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="bv-brand__accent">
                  <Book size={25} />
                </span>
                <span className="bv-brand__text mt-1" style={{ fontSize: "1rem" }}>
                  Book<span className="bv-brand__accent">Verse</span>
                </span>
              </div>
              <p className="mb-0" style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>
                Where every story finds its shelf.
              </p>
            </Col>
            <Col lg={6} className="d-flex flex-column align-items-lg-end gap-2">
              <div className="d-flex gap-3">
                <a href="#" className="bv-footer__social">
                  <Github size={17} />
                </a>
                <a href="#" className="bv-footer__social">
                  <TwitterX size={17} />
                </a>
                <a href="#" className="bv-footer__social">
                  <Instagram size={17} />
                </a>
              </div>
              <p className="mb-0 d-flex align-items-center gap-1" style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>
                © {currentYear} BookVerse — Made with
                <Heart size={11} fill="currentColor" style={{ color: "var(--st-review)" }} />
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default AppFooter;
