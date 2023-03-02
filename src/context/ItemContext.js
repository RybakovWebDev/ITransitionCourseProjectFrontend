import { createContext, useReducer } from "react";

export const ItemContext = createContext();

export const itemsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        items: action.payload,
      };
    case "POST_ITEM":
      return {
        items: action.payload,
      };
    case "CREATE_ITEM":
      return {
        items: [...state.items, action.payload],
      };
    case "DELETE_ITEM":
      return {
        items: state.items.filter((i) => i._id !== action.payload._id),
      };
    case "PATCH_ITEM":
      return {
        items: state.items.map((item) => (item._id === action.payload._id ? action.payload : item)),
      };
    default:
      return state;
  }
};

export const ItemContextProvider = ({ children }) => {
  const [state, dispatchItems] = useReducer(itemsReducer, {
    items: null,
  });

  return <ItemContext.Provider value={{ ...state, dispatchItems }}>{children}</ItemContext.Provider>;
};
