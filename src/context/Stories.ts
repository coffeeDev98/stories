import { StoriesContext } from "./../interfaces";
import React from "react";

export default React.createContext<StoriesContext>({
  loaded: false,
  setLoaded: () => {},
  cursor: { step: 0, clip: 0 },
});
