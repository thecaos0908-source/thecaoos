import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Configure Mercado Pago public key from env (overrides index.html if present)
if (typeof window !== 'undefined') {
  // @ts-expect-error augment window at runtime
  window.MP_PUBLIC_KEY = (import.meta as any).env?.VITE_MP_PUBLIC_KEY || window.MP_PUBLIC_KEY;
}

createRoot(document.getElementById("root")!).render(<App />);
