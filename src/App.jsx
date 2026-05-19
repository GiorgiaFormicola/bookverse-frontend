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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
