import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../contexts";
const host = import.meta.env.VITE_API_HOST;
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, refetchUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = { username, password };

    axios
      .post(`${host}/login`, payload, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/");
        refetchUser();
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.error || "Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div className={styles.mainContainer}>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleLoginSubmit} className={styles.form}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          Login
        </button>
      </form>
      <p>
        Need an account? <Link to={"/register"}>Register here</Link>
      </p>
    </div>
  );
}

export default Login;
