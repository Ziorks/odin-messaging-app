import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const host = import.meta.env.VITE_API_HOST;

function useFindAndGotoThread() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const findAndGotoThread = (userId) => {
    setIsLoading(true);
    setError(null);

    const url = `${host}/thread`;
    const payload = { recipientIds: [userId] };
    axios
      .post(url, payload, {
        withCredentials: true,
      })
      .then((resp) => {
        navigate(`/conversations/${resp.data.thread.id}`);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Something went wrong.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { findAndGotoThread, isLoading, error };
}

export default useFindAndGotoThread;
