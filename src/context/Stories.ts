import { StoriesContext } from "./../interfaces";
import React from "react";

export default React.createContext<StoriesContext>({
  loaded: false,
  setLoaded: () => {},
});
