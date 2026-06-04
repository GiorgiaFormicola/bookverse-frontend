import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Home, Library, Search, User, Shield, LogOut, Settings } from "lucide-react";
import { Navbar, Container, Nav, NavDropdown, Offcanvas } from "react-bootstrap";
import { Book } from "react-bootstrap-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CLEAR_PROFILE } from "../redux/actions";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((currentState) => currentState.profile.user);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navLinkClass = (path) => `nav-link d-flex align-items-center gap-2${location.pathname === path ? " active" : ""}`;
  const userLinkClass = (path) => `nav-link d-flex align-items-center gap-2${location.pathname === path ? " active-user" : ""}`;

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({
      type: CLEAR_PROFILE,
    });
    navigate("/login");
  };

  return (
    <>
      <Navbar sticky="top" className="bv-navbar">
        <Container fluid className="px-3 px-lg-4">
          <Navbar.Brand as={Link} to="/" className="bv-brand d-flex align-items-center gap-2 me-lg-4">
            <Book size={30} className="bv-brand__accent me-1" />
            <span className="bv-brand__text">
              Book<span className="bv-brand__accent">Verse</span>
            </span>
          </Navbar.Brand>

          {/* Nav links desktop */}
          <Nav className="d-none d-lg-flex me-auto gap-1">
            <Link to="/" className={navLinkClass("/")}>
              <Home size={16} strokeWidth={2.5} />
              <span>Home</span>
            </Link>
            <Link to="/library" className={navLinkClass("/library")}>
              <Library size={16} strokeWidth={2.5} />
              <span>My Library</span>
            </Link>
            <Link to="/search" className={navLinkClass("/search")}>
              <Search size={16} strokeWidth={2.5} />
              <span>Search</span>
            </Link>
          </Nav>

          {/* User area desktop */}
          <Nav className="align-items-center ms-auto gap-1">
            <Link to="/me" className={`d-none d-lg-flex ${userLinkClass("/me")} gap-2`}>
              <span className="bv-nav__username ps-1">{user?.displayName}</span>
              <img src={user?.profilePictureURL} alt={user?.username} className="bv-nav__avatar" width={40} height={40} />
            </Link>
            <NavDropdown id="user-dropdown" align="end" className="d-none d-lg-block bv-dropdown-toggle">
              <NavDropdown.Item as={Link} to="/me">
                <User size={16} className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/me/account">
                <Settings size={16} className="me-2" />
                Account
              </NavDropdown.Item>
              {user?.role === "ADMIN" && (
                <NavDropdown.Item as={Link} to="/admin">
                  <Shield size={16} className="me-2" />
                  Admin Panel
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout} className="text-danger">
                <LogOut size={16} className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>

            {/* Mobile avatar */}
            <img
              src={user?.profilePictureURL}
              alt={user?.username}
              className="bv-nav__avatar d-lg-none"
              width={40}
              height={40}
              style={{ cursor: "pointer" }}
              onClick={() => setShowOffcanvas(true)}
            />
          </Nav>
        </Container>
      </Navbar>

      {/* Offcanvas mobile */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" className="bv-offcanvas">
        <Offcanvas.Header closeButton closeVariant="white">
          <div className="d-flex align-items-center gap-3">
            <img src={user?.profilePictureURL} alt={user?.username} className="rounded-circle" width={50} height={50} />
            <div>
              <div className="fw-semibold fs-5">{user?.displayName}</div>
              <div className="text-muted">@{user?.username}</div>
            </div>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column gap-2 pt-2 px-0">
          <div className="d-flex flex-column gap-3 pb-3 px-3 my-2 border-bottom">
            <Link to="/me" className="nav-link d-flex align-items-center gap-2 fs-5" onClick={() => setShowOffcanvas(false)}>
              <User size={25} />
              Profile
            </Link>
            <Link to="/me/account" className="nav-link d-flex align-items-center gap-2 fs-5" onClick={() => setShowOffcanvas(false)}>
              <Settings size={25} />
              Account
            </Link>
            {user?.role === "ADMIN" && (
              <Link to="/admin" className="nav-link d-flex align-items-center gap-2 fs-5" onClick={() => setShowOffcanvas(false)}>
                <Shield size={25} />
                Admin Panel
              </Link>
            )}
          </div>
          <div className="px-3">
            <button
              className="btn btn-link nav-link d-flex align-items-center gap-2 text-danger px-3 fs-5 w-100 "
              onClick={() => {
                logout();
                setShowOffcanvas(false);
              }}
            >
              <LogOut size={25} />
              Logout
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AppNavbar;
