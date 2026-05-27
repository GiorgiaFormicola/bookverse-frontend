import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../../redux/actions";
/* import { useLocation, useNavigate } from "react-router-dom"; */

const ProfileLoader = () => {
  const dispatch = useDispatch();
  /* const location = useLocation();
  const navigate = useNavigate(); */
  const user = useSelector((currentState) => currentState.profile.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    /* if (location.pathname !== "/login" && location.pathname !== "/signup") { */
    if (token && !user) {
      dispatch(getProfileInfo());
    }
    /*  if (!token) {
        navigate("/login");
      }
    } */
  }, []);

  return null;
};

export default ProfileLoader;
