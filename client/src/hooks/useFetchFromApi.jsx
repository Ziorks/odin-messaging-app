import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const host = import.meta.env.VITE_API_HOST;

function useFetchFromApi(path) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();

  const doAbort = () => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }
  };

  const reset = () => {
    doAbort();
    setData(null);
    setIsLoading(false);
    setError(null);
  };

  const fetchData = useCallback(() => {
    doAbort();

    const controller = new AbortController();
    abortRef.current = () => controller.abort();

    setIsLoading(true);
    setError(null);

    axios
      .get(`${host}${path}`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((resp) => {
        setData(resp.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
          setData(null);
        } else {
          setError(err.response?.data?.error || "Something went wrong.");
        }
      })
      .finally(() => {
        setIsLoading(false);
        abortRef.current = null;
      });
  }, [path, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData, reset };
}

export default useFetchFromApi;
