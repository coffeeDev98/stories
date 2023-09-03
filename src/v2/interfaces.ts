import { CSSProperties } from "react";
import { Story } from "./types";

export interface GlobalProps {
  stories: Story[][];
  loader?: JSX.Element;
  loop?: boolean;
  isPaused?: boolean;
  isMuted?: boolean;
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

export interface StoriesContext {
  stories: Story[][];
  loaded: boolean;
  setLoaded: Function;
  cursor: { step: number; clip: number };
  action: Function;
  pause: boolean;
  muted: boolean;
  setMuted: Function;
}
