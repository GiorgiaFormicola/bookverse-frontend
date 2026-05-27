import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";

const AppLayout = ({ children }) => {
  /* if (!isAuthenticated) {
    return <>{children}</>;
  }
 */
  return (
    <div className="min-vh-100 d-flex flex-column">
      <AppNavbar />

      <main className="flex-grow-1 bg-secondary">{children}</main>

      <AppFooter />
    </div>
  );
};

export default AppLayout;
