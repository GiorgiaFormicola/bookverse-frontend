import { SET_ERROR, CLEAR_ERROR } from "../actions";

const initialState = {
  isPresent: false,
  status: null,
  message: null,
  errorsList: null,
};

const errorReducer = (currentState = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...currentState,
        isPresent: true,
        status: action.payload.status,
        message: action.payload.message,
        errorsList: action.payload.errorsList,
      };

    case CLEAR_ERROR:
      return {
        isPresent: false,
        status: null,
        message: null,
        errorsList: null,
      };

    default:
      return currentState;
  }
};

export default errorReducer;
