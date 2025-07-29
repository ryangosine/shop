import React from "react";
import ReactDOM from "react-dom/client";
import { CurrentUserProvider } from "./context/currentusercontext";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CurrentUserProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </CurrentUserProvider>
  </React.StrictMode>
);
