import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import UserProvider from "./context.tsx";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <UserProvider>
            <App />
          </UserProvider>
        </CookiesProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
