import "./App.scss";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProfileLoader from "./components/ProfileLoader";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage";
import LibraryPage from "./components/LibraryPage";
import SearchPage from "./components/SearchPage";
import BookDetailPage from "./components/BookDetailPage";
import ProfilePage from "./components/ProfilePage";
import EditProfilePage from "./components/EditProfilePage";
import AdminPage from "./components/AdminPage";
import AppLayout from "./components/AppLayout";
import DisabledPage from "./components/DisabledPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import AccountPage from "./components/AccountPage";
import ErrorPage from "./components/ErrorPage";

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
                <AppLayout>
                  <SearchPage />
                </AppLayout>
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
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/me/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AppLayout>
                  <AdminPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/account"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AccountPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/disabled" element={<DisabledPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
