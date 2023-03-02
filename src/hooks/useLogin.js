import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useCollectionsContext } from "./useCollectionsContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const { dispatchCollections } = useCollectionsContext();

  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const user = { email, password };

    const response = await fetch(`${process.env.REACT_APP_URI}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      console.log(json);
      localStorage.setItem("user", JSON.stringify(json));

      dispatch({ type: "LOGIN_USER", payload: json });

      setIsLoading(false);
      navigate("/");
    }

    // const responseCollections = await fetch(`${process.env.REACT_APP_URI}/api/collections/${name}`);
    // const jsonCollections = await responseCollections.json();
    // if (response.ok) {
    //   dispatchCollections({ type: "SET_COLLECTIONS", payload: jsonCollections });
    // }
  };

  return { login, isLoading, error };
};
