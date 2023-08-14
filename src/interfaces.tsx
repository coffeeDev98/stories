type NumberOrString = number | string;

export type Story = Array<
  Array<{
    url: string;
    type: string;
  }>
>;
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
  loaded: boolean;
  setLoaded: Function;
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
}

export type Action = (action: string) => void;
