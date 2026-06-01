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

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({
      type: CLEAR_PROFILE,
    });
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" sticky="top" className="shadow-sm">
        <Container fluid className="px-3 container-lg px-lg-4">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3 gap-lg-2 me-lg-4 ms-lg-2">
            <Book size={30} className="d-none d-lg-block" />
            <Book size={40} className="d-lg-none" />
            <span className="display-font d-sm-inline">BookVerse</span>
          </Navbar.Brand>
          <Nav className="d-none d-lg-flex me-auto gap-2">
            <Link to="/" className={navLinkClass("/")}>
              <Home strokeWidth={2.5} />
              <span>Home</span>
            </Link>

            <Link to="/library" className={navLinkClass("/library")}>
              <Library strokeWidth={2.5} />
              <span>My Library</span>
            </Link>

            <Link to="/search" className={navLinkClass("/search")}>
              <Search strokeWidth={2.5} />
              <span>Search</span>
            </Link>
          </Nav>
          <Nav className="align-items-center ms-auto">
            <Link to="/me" className={`d-none d-lg-flex ${navLinkClass("/me")} gap-3`}>
              <span>{user?.displayName}</span>
              <img src={user?.profilePictureURL} alt={user?.username} className="rounded-circle" width={40} height={40} />
            </Link>
            <NavDropdown id="user-dropdown" align="end" className="d-none d-lg-block">
              <NavDropdown.Item as={Link} to="/me">
                <User size={18} className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/me/account">
                <Settings size={18} className="me-2" />
                Account
              </NavDropdown.Item>
              {user?.role === "ADMIN" && (
                <NavDropdown.Item as={Link} to="/admin">
                  <Shield size={18} className="me-2" />
                  Admin Panel
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => logout()} className="text-danger">
                <LogOut size={18} className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
            <img
              src={user?.profilePictureURL}
              alt={user?.username}
              className="rounded-circle d-lg-none"
              width={40}
              height={40}
              style={{ cursor: "pointer" }}
              onClick={() => setShowOffcanvas(true)}
            />
          </Nav>
        </Container>
      </Navbar>

      {/* OFFCANVAS MOBILE */}

      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" className="bg-dark text-white p-2">
        <Offcanvas.Header closeButton closeVariant="white">
          <div className="d-flex align-items-center gap-3">
            <img src={user?.profilePictureURL} alt={user?.username} className="rounded-circle" width={50} height={50} />
            <div>
              <div className="fw-semibold fs-5">{user?.displayName}</div>
              <div className="text-muted">@{user?.username}</div>
            </div>
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column gap-2 pt-2">
          <div className="d-flex flex-column gap-3 border-bottom border-secondary pb-3 my-2">
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
          <button
            className="btn btn-link nav-link d-flex align-items-center gap-2 text-danger p-0 fs-5"
            onClick={() => {
              logout();
              setShowOffcanvas(false);
            }}
          >
            <LogOut size={25} />
            Logout
          </button>
        </Offcanvas.Body>
      </Offcanvas>
      {/* OFFCANVAS MOVILE */}
    </>
  );
};

export default AppNavbar;
