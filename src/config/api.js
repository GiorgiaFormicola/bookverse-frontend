import axios from "axios";
import store from "../redux/store";
import { CLEAR_PROFILE, SET_ERROR } from "../redux/actions";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,

  (error) => {
    const errorPayload = {
      status: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "Something went wrong with the server, try again later!",
      errorsList: error.response?.data?.errors ?? [],
    };
    if (error.response?.status === 403 && error.response?.data?.error === "ACCOUNT_DISABLED") {
      localStorage.removeItem("token");
      try {
        const requestBody = error.config.data ? JSON.parse(error.config.data) : {};
        if (requestBody?.email) {
          sessionStorage.setItem("disabledEmail", requestBody.email);
        }
      } catch (err) {
        //
      }
      error.handled = true;
      window.location.replace("/disabled");
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      if (window.location.pathname === "/login") {
        return Promise.reject(error);
      } else {
        error.handled = true;
        localStorage.removeItem("token");
        store.dispatch({ type: CLEAR_PROFILE });
        window.location.replace("/login");
        return Promise.reject(error);
      }
    }

    if (!error.response) {
      error.handled = true;
      window.location.replace("/error?type=network");
      return Promise.reject(error);
    }

    store.dispatch({
      type: SET_ERROR,
      payload: errorPayload,
    });
    return Promise.reject(error);
  },
);
