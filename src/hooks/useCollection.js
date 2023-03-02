import { useState } from "react";
import { useCollectionsContext } from "./useCollectionsContext";

export const useCollection = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const postCollection = async (_id, name, description, category, author, image, customFields) => {
    setIsLoading(true);
    setError(null);
    const collection = { _id, name, description, category, author, image, customFields };
    console.log("Fetching this collection", JSON.stringify(collection));

    const response = await fetch(`${process.env.REACT_APP_URI}/api/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collection),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      setIsLoading(false);
    }
  };

  return { postCollection, isLoading, error };
};
