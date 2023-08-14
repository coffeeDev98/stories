import React from "react";
import { ProgressContext } from "./../interfaces";

export default React.createContext<ProgressContext>({
  currentId: { step: 0, clip: 0 },
  stepDuration: 0,
  clipDuration: 0,
  //   bufferAction: false,
  pause: false,
  next: () => {},
});
