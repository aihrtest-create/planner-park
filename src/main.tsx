
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initMiniApp } from "./lib/miniapp";

  // Initialize Mini App SDK before React renders
  initMiniApp();

  createRoot(document.getElementById("root")!).render(<App />);
  