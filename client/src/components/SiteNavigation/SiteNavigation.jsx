import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../contexts";
const host = import.meta.env.VITE_API_HOST;
import ProfilePic from "../ProfilePic/ProfilePic";
import logo from "../../assets/logo.svg";
import styles from "./SiteNavigation.module.css";

function SiteNavigation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const { user, clearUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    setError(null);

    axios
      .get(`${host}/logout`, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/");
        clearUser();
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.error || "Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <nav className={styles.navContainer}>
      <Link to={"/"}>
        <img src={logo} style={{ width: "50px" }} />
      </Link>
      {isLoading && <p>Logging out...</p>}
      {error && <p>{error}</p>}
      {user && (
        <div className={styles.dropdown}>
          <button onClick={toggleShowMenu} className={styles.dropBtn}>
            <ProfilePic src={user.profile.pictureURL} size={50} />
          </button>
          <div
            className={`${styles.dropdownContent} ${showMenu ? styles.show : ""}`}
            onClick={toggleShowMenu}
          >
            <Link to={"/users"}>Users</Link>
            <Link to={"/conversations"}>Conversations</Link>
            <Link to={"/my-profile"}>Edit Profile</Link>
            <button onClick={handleLogout} disabled={isLoading}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default SiteNavigation;
