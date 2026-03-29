import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts";
const host = import.meta.env.VITE_API_HOST;
import styles from "./Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    const payload = { username, password, passwordConfirmation };

    axios
      .post(`${host}/register`, payload, {
        withCredentials: true,
      })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);

        if (err.response?.status === 400) {
          setErrors(err.response.data.errors);
        } else {
          setErrors([
            { msg: err.response?.data?.message || "Something went wrong." },
          ]);
        }
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
      {success ? (
        <p>
          Registration successful! Login <Link to={"/login"}>here</Link>
        </p>
      ) : (
        <>
          {errors && (
            <ul>
              {errors.map((error, i) => (
                <li key={i}>{error.msg}</li>
              ))}
            </ul>
          )}
          <form onSubmit={handleRegisterSubmit} className={styles.form}>
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
            <div>
              <label htmlFor="passwordConfirmation">Confirm Password: </label>
              <input
                type="password"
                name="passwordConfirmation"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isLoading}>
              Register
            </button>
          </form>
          <p>
            Already have an account? <Link to={"/login"}>Login here</Link>
          </p>
        </>
      )}
    </div>
  );
}

export default Register;
