import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../../redux/actions";
import { useLocation } from "react-router-dom";

const ProfileLoader = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((currentState) => currentState.profile.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!location.pathname === "/login" && !location.pathname === "/signIn") {
      if (token && !user) {
        dispatch(getProfileInfo());
      }
    }
  }, []);

  return null;
};

export default ProfileLoader;
