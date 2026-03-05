import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SprintDash from "./SprintDash.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SprintDash />
  </StrictMode>
);
