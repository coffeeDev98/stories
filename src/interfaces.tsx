type NumberOrString = number | string;

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

export interface ProgressContext {
  currentId: number;
  videoDuration: number;
  bufferAction?: boolean;
  pause: boolean;
  next?: Function;
}
