import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UsersContextProvider } from "./context/UserContext";
import { CollectionContextProvider } from "./context/CollectionContext";
import { ItemContextProvider } from "./context/ItemContext";
import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UsersContextProvider>
        {/* replace or remove */}
        <CollectionContextProvider>
          <ItemContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ItemContextProvider>
        </CollectionContextProvider>
      </UsersContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
