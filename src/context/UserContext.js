import { createContext, useReducer } from "react";

export const UsersContext = createContext();

export const usersReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return {
        users: action.payload,
      };
    case "LOGIN_USER":
      return {
        user: action.payload,
      };
    case "CREATE_USER":
      return {
        users: [...state.users, action.payload],
      };
    case "DELETE_USER":
      return {
        users: state.users.filter((u) => u._id !== action.payload._id),
      };
    case "PATCH_USER":
      return {
        users: state.users.map((user) => (user._id === action.payload._id ? action.payload : user)),
      };
    default:
      return state;
  }
};

export const UsersContextProvider = ({ children }) => {
  const [state, dispatchUsers] = useReducer(usersReducer, {
    users: null,
  });

  return <UsersContext.Provider value={{ ...state, dispatchUsers }}>{children}</UsersContext.Provider>;
};
