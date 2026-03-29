import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const host = import.meta.env.VITE_API_HOST;

function useSendUpdate(onSuccess) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const clearErrors = () => {
    setErrors(null);
  };

  const sendUpdate = (path, payload, { multipart = false } = {}) => {
    setIsLoading(true);
    setErrors(null);

    if (multipart) {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value) formData.append(key, value);
      });
      payload = formData;
    }

    axios
      .put(`${host}${path}`, payload, {
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

  return { sendUpdate, clearErrors, isLoading, errors };
}

export default useSendUpdate;
