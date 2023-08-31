import { Maybe } from "./types";

type NumberOrString = number | string;

export type Story = {
  id: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  __typename: string;
};

export interface GlobalCtx {
  width?: NumberOrString;
  height?: NumberOrString;
  loader?: JSX.Element;
  storyStyles?: Object;
  progressContainerStyles?: Object;
  progressWrapperStyles?: Object;
  progressStyles?: Object;
  loop?: boolean;
  defaultInterval?: number;
  isPaused?: boolean;
  currentIndex?: number;
  onAllStoriesEnd?: Function;
  onStoryStart?: Function;
  onStoryEnd?: Function;
  onPrevious?: Function;
  onNext?: Function;
  keyboardNavigation?: boolean;
  preventDefault?: boolean;
  preloadCount?: number;
}

export interface StoriesContext {
  stories: Story[][];
  loaded: boolean;
  setLoaded: Function;
  cursor: { step: number; clip: number };
}

export interface ProgressContext {
  currentId: { step: number; clip: number };
  stepDuration: number;
  clipDuration: number;
  // setClipDuration: Function;
  bufferAction?: boolean;
  pause: boolean;
  togglePause: Function;
  previous: Function;
  next: Function;
  skippedProgress?: number;
  resetProgress?: Maybe<"all" | "step" | "clip">;
  onProgressReset?: Function;
}

export type Action = (action: string) => void;
