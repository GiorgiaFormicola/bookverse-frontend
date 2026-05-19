import { instance } from "../../config/api";
export const GET_PROFILE = "GET_PROFILE";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const CLEAR_PROFILE = "CLEAR_PROFILE";
export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const getProfileInfo = () => {
  return (dispatch) => {
    instance
      .get("/users/me")
      .then((response) => {
        console.log(response.data);
        dispatch({
          type: GET_PROFILE,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateProfiloInfo = (body) => {
  return (dispatch) => {
    instance
      .put("/users/me", body)
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

export const updateProfilePicture = (formData) => {
  return (dispatch) => {
    instance
      .patch("/users/me/picture", formData)
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
