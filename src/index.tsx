import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

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

ReactDOM.render(<App />, document.getElementById("root"));
