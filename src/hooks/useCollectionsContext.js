import { CollectionContext } from "../context/CollectionContext";
import { useContext } from "react";

export const useCollectionsContext = () => {
  const context = useContext(CollectionContext);

  if (!context) {
    throw Error("useCollectionContext must be used inside an UsersContextProvider");
  }

  return context;
};
