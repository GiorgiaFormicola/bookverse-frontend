import { ADD_BOOK, CLEAR_PROFILE, GET_PROFILE, REMOVE_BOOK, UPDATE_PROFILE, UPDATE_BOOK } from "../actions";

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

    case ADD_BOOK:
      return {
        ...currentState,
        savedBooks: {
          ...currentState.savedBooks,
          ...action.payload,
        },
      };

    case REMOVE_BOOK: {
      const newSavedBooks = { ...currentState.savedBooks };
      delete newSavedBooks[action.payload];
      return {
        ...currentState,
        savedBooks: newSavedBooks,
      };
    }

    case UPDATE_BOOK: {
      return {
        ...currentState,
        savedBooks: {
          ...currentState.savedBooks,
          ...action.payload,
        },
      };
    }

    default:
      return currentState;
  }
};

export default profileReducer;
