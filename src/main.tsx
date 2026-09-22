import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { loadWebhookSettings } from "@/lib/webhookSettings";

// Pull the current webhook links from the backend settings table.
// Non-blocking: the app renders immediately with the built-in defaults.
loadWebhookSettings();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
