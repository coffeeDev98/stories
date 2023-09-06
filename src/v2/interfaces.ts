import { CSSProperties } from "react";
import { Cursor, Story } from "./types";

export interface GlobalProps {
  cursor?: Cursor;
  stories: Story[][];
  loader?: JSX.Element;
  loop?: boolean;
  isPaused?: boolean;
  isMuted?: boolean;
  isFullscreen?: boolean;
  onAllStoriesEnd?: Function;
  onStoryStart?: Function;
  onStoryEnd?: Function;
  onPrevious?: Function;
  onNext?: Function;
  onPause?: Function;
  onPlay?: Function;
  keyboardNavigation?: boolean;
  touchNavigation?: boolean;
  styles?: {
    container?: CSSProperties;
    video?: CSSProperties;
  };
}

export interface StoriesContext {
  loader?: JSX.Element;
  stories: Story[][];
  loaded: boolean;
  setLoaded: Function;
  cursor: { step: number; clip: number };
  action: Function;
  pause: boolean;
  isMuted: boolean;
  fullscreen: boolean;
  next: Function;
  previous: Function;
  fullscreenHandler: Function;
}
