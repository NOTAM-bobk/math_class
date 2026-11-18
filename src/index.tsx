import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initCookieStore } from "./lib/cookieStore";
import { initSystemFont } from "./lib/systemFont";

initCookieStore();
initSystemFont();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
