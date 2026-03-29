import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const host = import.meta.env.VITE_API_HOST;

const initialValues = { search: "", page: 1, resultsPerPage: 10 };

function useSearch(path) {
  const [search, setSearch] = useState(initialValues.search);
  const [page, setPage] = useState(initialValues.page);
  const [resultsPerPage, setResultsPerPage] = useState(
    initialValues.resultsPerPage,
  );
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTimeoutRef = useRef(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();

  const fetchSearch = useCallback(
    ({ search, page, resultsPerPage }, onSuccess) => {
      if (abortRef.current) {
        abortRef.current();
        abortRef.current = null;
      }

      const controller = new AbortController();
      abortRef.current = () => controller.abort();

      setIsLoading(true);
      setError(null);

      const url = `${host}${path}/?search=${search}&page=${page}&resultsPerPage=${resultsPerPage}`;
      axios
        .get(url, {
          withCredentials: true,
          signal: controller.signal,
        })
        .then((resp) => {
          setResults(resp.data.results);
          onSuccess?.();
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          console.log(err);
          if (err.response?.status === 401) {
            navigate("/login");
          } else {
            setError(err.response?.data?.error || "Something went wrong.");
          }
        })
        .finally(() => {
          setIsLoading(false);
          abortRef.current = null;
        });
    },
    [path, navigate],
  );

  useEffect(() => {
    //timeout is here so state setters in fetchSearch trigger
    const timeout = setTimeout(() => {
      fetchSearch(initialValues);
    }, 0);

    return () => clearTimeout(timeout);
  }, [fetchSearch]);

  const handleSearchChange = (search) => {
    clearTimeout(fetchTimeoutRef.current);

    const doFetch = () => {
      fetchSearch({ search, page: 1, resultsPerPage }, () => {
        setPage(1);
      });
    };

    setSearch(search);
    fetchTimeoutRef.current = setTimeout(doFetch, 1000);
  };

  const handlePrev = () => {
    if (isLoading) return;
    const prevPage = page - 1;
    fetchSearch({ search, page: prevPage, resultsPerPage }, () =>
      setPage(prevPage),
    );
  };

  const handleNext = () => {
    if (isLoading) return;
    const nextPage = page + 1;
    fetchSearch({ search, page: nextPage, resultsPerPage }, () =>
      setPage(nextPage),
    );
  };

  const handleSetPage = (page) => {
    if (isLoading) return;
    fetchSearch({ search, page, resultsPerPage }, () => setPage(page));
  };

  const handleChangeResultsPerPage = (resultsPerPage) => {
    if (isLoading) return;
    fetchSearch({ search, page: 1, resultsPerPage }, () => {
      (setPage(1), setResultsPerPage(resultsPerPage));
    });
  };

  const queryHandlers = {
    handleSearchChange,
    handlePrev,
    handleNext,
    handleSetPage,
    handleChangeResultsPerPage,
  };

  return {
    search,
    page,
    resultsPerPage,
    results,
    isLoading,
    error,
    queryHandlers,
  };
}

export default useSearch;
