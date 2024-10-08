import { createRoot } from "react-dom/client";
//
import "@/src/_globals.scss";
//
import { App } from "@/src/app";

createRoot(document.getElementById("app") as HTMLElement).render(<App />);
