import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const host = import.meta.env.VITE_API_HOST;

function useSendMessage(threadId, onSuccess) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const sendMessage = (message) => {
    setIsLoading(true);
    setErrors(null);

    const payload = {
      body: message,
      threadId,
    };

    axios
      .post(`${host}/message`, payload, {
        withCredentials: true,
      })
      .then(() => {
        onSuccess?.();
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 400) {
          setErrors(err.response.data.errors);
        } else {
          setErrors([
            { msg: err.response?.data?.error || "Something went wrong." },
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { sendMessage, isLoading, errors };
}

export default useSendMessage;
