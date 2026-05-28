import { useDispatch, useSelector } from "react-redux";
import { Home, Library, Search, User, Shield, LogOut } from "lucide-react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Book } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { CLEAR_PROFILE } from "../redux/actions";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((currentState) => currentState.profile.user);
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({
      type: CLEAR_PROFILE,
    });
    navigate("/login");
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container fluid className="px-3 px-lg-4">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <Book size={28} />
          <span className="display-font d-none d-sm-inline">BookVerse</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-2">
              <Home size={18} />
              <span>Home</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/library" className="d-flex align-items-center gap-2">
              <Library size={18} />
              <span>My Library</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className="d-flex align-items-center gap-2">
              <Search size={18} />
              <span>Search</span>
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <span className="d-flex align-items-center gap-2">
                  <User size={18} />
                  <span className="d-none d-lg-inline">{user?.displayName}</span>
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/me">
                <User size={16} className="me-2" />
                Profile
              </NavDropdown.Item>
              {user?.role === "ADMIN" && (
                <NavDropdown.Item as={Link} to="/admin">
                  <Shield size={16} className="me-2" />
                  Admin Panel
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => logout()}>
                <LogOut size={16} className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
