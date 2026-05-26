import "./App.scss";
import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import SignInPage from "./components/SignInPage/SignInPage";
import HomePage from "./components/HomePage/HomePage";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProfileLoader from "./components/ProfileLoader/ProfileLoader";
import BookDetail from "./components/BookDetail/BookDetail";
import SearchPage from "./components/SearchPage/SearchPage";
import LibraryPage from "./components/LibraryPage/LibraryPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import UpdateProfilePage from "./components/UpdateProfilePage/UpdateProfilePage";
import AdminPage from "./components/AdminPage/AdminPage";
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
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:googleId" element={<BookDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/me/edit" element={<UpdateProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
