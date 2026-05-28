import { instance } from "../../config/api";
export const GET_PROFILE = "GET_PROFILE";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const CLEAR_PROFILE = "CLEAR_PROFILE";
export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const ADD_BOOK = "ADD_BOOK";
export const REMOVE_BOOK = "REMOVE_BOOK";
export const UPDATE_BOOK = "UPDATE_BOOK";
export const SET_AUTH_CHECKED = "SET_AUTH_CHECKED";

export const getProfileInfo = () => {
  return (dispatch) => {
    instance
      .get("/users/me")
      .then((response) => {
        const savedBooksMap = response.data.savedBooks.reduce((acc, book) => {
          acc[book.googleId] = {
            public: book.public,
            status: book.status,
          };
          return acc;
        }, {});

        dispatch({
          type: GET_PROFILE,
          payload: {
            user: response.data.user,
            savedBooks: savedBooksMap,
          },
        });

        dispatch({
          type: SET_AUTH_CHECKED,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateProfileInfo = (body) => {
  return (dispatch) => {
    return instance.put("/users/me", body).then((response) => {
      console.log(response.data);
      dispatch({
        type: UPDATE_PROFILE,
        payload: response.data,
      });
      return response.data;
    });
    /* .catch((error) => {
        console.log(error);
      }); */
  };
};

export const updateProfilePicture = (formData) => {
  return (dispatch) => {
    return instance.patch("/users/me/picture", formData).then((response) => {
      console.log(response.data);
      dispatch({
        type: UPDATE_PROFILE,
        payload: response.data,
      });
      return response.data;
    });
    /* .catch((error) => {
        console.log(error);
      }); */
  };
};

export const updateProfileEmail = (body) => {
  return (dispatch) => {
    instance
      .patch("/users/me/email", body)
      .then((response) => {
        console.log(response.data);
        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateProfilePassword = (body) => {
  return (dispatch) => {
    instance
      .patch("/users/me/password", body)
      .then((response) => {
        console.log(response.data);
        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deleteProfile = () => {
  return (dispatch) => {
    instance
      .delete("/users/me")
      .then((response) => {
        console.log(response);
        localStorage.removeItem("token");
        dispatch({
          type: CLEAR_PROFILE,
        });

        window.location.replace("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addBookToLibrary = (book) => {
  return (dispatch) => {
    instance
      .post("/me/books", book)
      .then((response) => {
        console.log(response);
        const googleId = response.data.book.googleId;
        const isPublic = response.data.public;
        const status = response.data.status;
        const savedBookMap = {
          [googleId]: {
            public: isPublic,
            status: status,
          },
        };

        dispatch({
          type: ADD_BOOK,
          payload: savedBookMap,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const removeBookFromLibrary = (googleId) => {
  return (dispatch) => {
    instance
      .delete("/me/books/" + googleId)
      .then((response) => {
        console.log(response);
        dispatch({
          type: REMOVE_BOOK,
          payload: googleId,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const setBookPrivacy = (googleId, boolean) => {
  return (dispatch) => {
    instance
      .patch("/me/books/" + googleId + "/visibility", { isPublic: boolean })
      .then((response) => {
        console.log(response);
        const googleId = response.data.book.googleId;
        const isPublic = response.data.public;
        const status = response.data.status;
        const updatedBookMap = {
          [googleId]: {
            public: isPublic,
            status: status,
          },
        };

        dispatch({
          type: UPDATE_BOOK,
          payload: updatedBookMap,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateBookStatus = (googleId, statusValue) => {
  return (dispatch) => {
    instance
      .patch("/me/books/" + googleId + "/status", { status: statusValue })
      .then((response) => {
        console.log(response);
        const googleId = response.data.book.googleId;
        const isPublic = response.data.public;
        const status = response.data.status;
        const updatedBookMap = {
          [googleId]: {
            public: isPublic,
            status: status,
          },
        };

        dispatch({
          type: UPDATE_BOOK,
          payload: updatedBookMap,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
