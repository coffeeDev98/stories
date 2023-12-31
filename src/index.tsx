import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import AppV2 from "./App";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`/ios-video-sw.js`)
      .then((registration) => {
        console.log("prefetch-sw registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("prefetch-sw registration failed: ", registrationError);
      });
  });
}

createRoot(document.getElementById("root") as HTMLElement).render(<AppV2 />);
// ReactDOM.render(<App />, document.getElementById("root"));
