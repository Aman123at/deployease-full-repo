import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContextProvider.tsx";
import { ProjectContextProvider } from "./context/ProjectContextProvider.tsx";
import { ToastContextProvider } from "./context/ToastContextProvider.tsx";
import { GlobalLoaderContextProvider } from "./context/GlobalLoaderContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GlobalLoaderContextProvider>

  <ToastContextProvider>
  <AuthContextProvider>
    <ProjectContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ProjectContextProvider>
  </AuthContextProvider>
  </ToastContextProvider>
  </GlobalLoaderContextProvider>,
);
