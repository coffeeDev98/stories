import { StoriesContext } from "./../interfaces";
import React from "react";

export default React.createContext<StoriesContext>({
  stories: [],
  loaded: false,
  setLoaded: () => {},
  cursor: { step: 0, clip: 0 },
});
