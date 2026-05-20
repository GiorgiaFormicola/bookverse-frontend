import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../reducers/profileReducer";
import errorReducer from "../reducers/errorReducer";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    error: errorReducer,
  },
});

export default store;
