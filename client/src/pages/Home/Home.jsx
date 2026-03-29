import { useContext } from "react";
import { GlobalContext } from "../../contexts";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  const { user } = useContext(GlobalContext);

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.header}>
        Messaging That <span className={styles.highlight}>Just Works</span>
      </h1>
      <p className={styles.subheader}>
        Private messaging, customizable profiles, and a clean, simple design.
        CSET is everything you need in a messaging app, and nothing that you
        don't.
      </p>
      <div className={styles.linkContainer}>
        {user ? (
          <>
            <Link to={"/users"}>User Search</Link>{" "}
            <Link to={"/conversations"}>My Conversations</Link>
          </>
        ) : (
          <>
            <Link to={"/login"}>Login</Link>{" "}
            <Link to={"/register"}>Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
