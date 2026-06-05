import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./index.css";

createRoot(document.body).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
