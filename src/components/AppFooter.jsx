import { Container } from "react-bootstrap";
import { BookOpen } from "lucide-react";
const AppFooter = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <BookOpen size={24} />
              <span className="display-font h5 mb-0">BookVerse</span>
            </div>
            <p className="text-muted small mb-0">Your personal reading companion</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted small mb-0">© 2024 BookVerse. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default AppFooter;
