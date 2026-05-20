import "./App.scss";
<<<<<<< Updated upstream

function App() {
  return <></>;
=======
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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
>>>>>>> Stashed changes
}

export default App;
