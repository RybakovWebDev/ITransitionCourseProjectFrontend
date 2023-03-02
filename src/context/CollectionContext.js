import { createContext, useReducer } from "react";

export const CollectionContext = createContext();

export const collectionsReducer = (state, action) => {
  switch (action.type) {
    case "SET_COLLECTIONS":
      return {
        collections: action.payload,
      };
    case "POST_COLLECTION":
      return {
        collection: action.payload,
      };
    case "CREATE_COLLECTION":
      return {
        collections: [...state.collections, action.payload],
      };
    case "DELETE_COLLECTION":
      return {
        collections: state.collections.filter((c) => c._id !== action.payload._id),
      };
    case "PATCH_COLLECTION":
      return {
        collections: state.collections.map((collection) =>
          collection._id === action.payload._id ? action.payload : collection
        ),
      };
    default:
      return state;
  }
};

export const CollectionContextProvider = ({ children }) => {
  const [state, dispatchCollections] = useReducer(collectionsReducer, {
    userCollections: null,
  });

  return <CollectionContext.Provider value={{ ...state, dispatchCollections }}>{children}</CollectionContext.Provider>;
};
