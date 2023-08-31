import { CSSProperties } from "react";
import { Story } from "./types";

export interface GlobalProps {
  stories: Story[][];
  loader?: JSX.Element;
  loop?: boolean;
  isPaused?: boolean;
  onAllStoriesEnd?: Function;
  onStoryStart?: Function;
  onStoryEnd?: Function;
  onPrevious?: Function;
  onNext?: Function;
  keyboardNavigation?: boolean;
  touchNavigation?: boolean;
  preloadCount?: number;
  styles?: {
    container?: CSSProperties;
    video?: CSSProperties;
  };
}
