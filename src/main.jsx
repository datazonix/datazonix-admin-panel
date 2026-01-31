// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import AppRouter from "./router/AppRouter.jsx";
import store from "./redux/store";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider>
      <ModalsProvider>
        <Notifications zIndex={1000000000} position="top-right"/>
        <RouterProvider router={AppRouter} />
      </ModalsProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>
);
