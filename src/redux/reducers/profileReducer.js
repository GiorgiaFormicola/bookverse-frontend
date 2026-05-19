import { CLEAR_PROFILE, GET_PROFILE, UPDATE_PROFILE } from "../actions";

const initialState = {
  user: null,
  savedBooks: null,
};

const profileReducer = (currentState = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...currentState,
        user: action.payload.user,
        savedBooks: action.payload.savedBooks,
      };

    case UPDATE_PROFILE:
      return {
        ...currentState,
        user: action.payload,
      };

    case CLEAR_PROFILE:
      return {
        ...currentState,
        user: null,
        savedBooks: null,
      };

    default:
      return currentState;
  }
};

export default profileReducer;
