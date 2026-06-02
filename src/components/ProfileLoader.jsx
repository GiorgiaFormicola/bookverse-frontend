import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../redux/actions";

const ProfileLoader = () => {
  const dispatch = useDispatch();
  const user = useSelector((currentState) => currentState.profile.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isErrorPage = window.location.pathname === "/error";

    if (token && !user && !isErrorPage) {
      dispatch(getProfileInfo());
    }
  }, [user]);

  return null;
};

export default ProfileLoader;
