import React from "react";
import { StoriesContext } from "../interfaces";

export default React.createContext<StoriesContext>({
  stories: [],
  loaded: false,
  setLoaded: () => {},
  cursor: { step: 0, clip: 0 },
  action: () => {},
  pause: false,
  isMuted: false,
  fullscreen: false,
  next: () => {},
  previous: () => {},
  fullscreenHandler: () => {},
  firstLoad: true,
  setFirstLoad: () => {},
  disableTouchEvent: false,
  debouncePause: () => {},
  mouseUp: () => {},
});
