import { CSSProperties } from "react";
import { Cursor, Story } from "./types";

interface StylingProps {
  styles?: {
    container?: CSSProperties;
    videoContainer?: CSSProperties;
    mediaControls?: {
      container?: CSSProperties;
      close?: CSSProperties;
      prev?: CSSProperties;
      play?: CSSProperties;
      next?: CSSProperties;
      volume?: CSSProperties;
      fullscreen?: CSSProperties;
    };
  };
  icons?: {
    close?: any;
    prev?: any;
    pause?: any;
    play?: any;
    next?: any;
    mute?: any;
    unmute?: any;
    expand?: any;
    shrink?: any;
  };
}
export interface GlobalContext extends StylingProps {
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
}

export interface StoriesContext extends StylingProps {
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
  firstLoad: boolean;
  setFirstLoad: Function;
  disableTouchEvent: boolean;
  debouncePause: (e: any) => void;
  mouseUp: Function;
}
