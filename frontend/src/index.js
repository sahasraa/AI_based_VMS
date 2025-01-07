import React from "react";
import "rsuite/dist/rsuite.min.css";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";

import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import { Provider } from "react-redux";
import store from "./redux/store";

import "primereact/resources/themes/saga-blue/theme.css"; // Example if using PrimeReact
import "primereact/resources/primereact.min.css"; // PrimeReact core styles
import "primeicons/primeicons.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Wrap the entire app, including RouterProvider, with the Provider */}

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
