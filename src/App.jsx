import "./App.scss";
import "./App.css";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProfileLoader from "./components/ProfileLoader/ProfileLoader";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage/HomePage";
import LibraryPage from "./components/LibraryPage/LibraryPage";
import SearchPage from "./components/SearchPage/SearchPage";
import BookDetailPage from "./components/BookDetailPage/BookDetailPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import UpdateProfilePage from "./components/UpdateProfilePage/UpdateProfilePage";
import AdminPage from "./components/AdminPage/AdminPage";
import AppLayout from "./components/AppLayout";

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ProfileLoader />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HomePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LibraryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/books/:googleId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BookDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me/edit"
            element={
              <ProtectedRoute>
                <UpdateProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
