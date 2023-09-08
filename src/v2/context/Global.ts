import React from "react";
import { GlobalContext } from "../interfaces";

export default React.createContext<GlobalContext>({
  stories: [],
});
