import { createRoot } from "react-dom/client";
import { App } from "./app";

(async () => {
  const root = document.getElementById("app")!;

  createRoot(root).render(<App />);
})();
