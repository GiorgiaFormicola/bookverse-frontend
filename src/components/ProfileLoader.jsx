import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../redux/actions";

const ProfileLoader = () => {
  const dispatch = useDispatch();

  const user = useSelector((currentState) => currentState.profile.user);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !user) {
      dispatch(getProfileInfo());
    }
  }, []);

  return null;
};

export default ProfileLoader;
