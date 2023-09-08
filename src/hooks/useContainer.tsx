import React, {
  CSSProperties,
  FC,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { GlobalContext } from "../interfaces";
import { Cursor, Maybe, Story } from "../types";
import usePrefetch from "./usePrefetch";
import StoriesContext from "../context/Stories";
import Video from "../components/Video";
import useProgress from "./useProgress";
import { styled } from "styled-components";
import fscreen from "../components/fscreen";

const useContainer: (props: GlobalContext) => {
  cursor: Cursor;
  fullscreen: boolean;
  Content: any;
  contentProps: any;
  progressArray: any[];
} = ({
  cursor: inputCursor,
  stories: inputStories,
  loader,
  loop,
  isPaused = false,
  isMuted = false,
  isFullscreen = false,
  onAllStoriesEnd,
  onStoryStart,
  onStoryEnd,
  onPrevious,
  onNext,
  onPause,
  onPlay,
  keyboardNavigation,
  touchNavigation,
  styles,
  icons,
}) => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [stories, setStories] = useState<any[][]>([]);
  const [cursor, setCursor] = useState<Cursor>(
    inputCursor && inputStories[inputCursor?.step].length > 0
      ? { step: inputCursor.step, clip: 0 }
      : { step: 0, clip: 0 }
  );
  const [clipDuration, setClipDuration] = useState<number>(0);
  const [stepDuration, setStepDuration] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [bufferAction, setBufferAction] = useState<boolean>(true);
  const [skippedProgress, setSkippedProgress] = useState<number>(0);
  const [resetProgress, setResetProgress] =
    useState<Maybe<"all" | "step" | "clip">>();

  // keyboard handler
  const [disableKeyEvent, setDisableKeyEvent] = useState<boolean>(false);
  const [disableTouchEvent, setDisableTouchEvent] = useState<boolean>(false);

  //   refs
  const touchId = useRef<any>();

  const { sd, cd, loaded, setLoaded, forStep } = usePrefetch(
    inputStories,
    cursor
  );
  // configure to input props
  useEffect(() => {
    if (typeof isPaused === "boolean") toggleState(isPaused ? "pause" : "play");
  }, [isPaused]);
  useEffect(() => {
    if (inputStories.length > 0) {
      setStories((prev) => {
        return inputStories.map((step: Story[], si: number) =>
          step.map((clip: Story, ci: number) => {
            return Video({ step: si, clip: ci });
          })
        );
      });
    }
  }, [inputStories]);
  useEffect(() => {
    setCursor({ step: inputCursor?.step || 0, clip: 0 });
  }, [inputCursor?.step]);
  useEffect(() => {
    if (isFullscreen && !fullscreen) fullscreenHandler();
    // setFullscreen(isFullscreen);
  }, [isFullscreen, fullscreen]);
  useEffect(() => {
    typeof keyboardNavigation === "boolean" &&
      setDisableKeyEvent(!keyboardNavigation);
    typeof touchNavigation === "boolean" &&
      setDisableTouchEvent(!touchNavigation);
  }, [keyboardNavigation, touchNavigation]);

  useEffect(() => {
    if (cd.length > 0 && sd.length > 0) {
      setStepDuration(sd[cursor.step]);
      setClipDuration(cd[cursor.step]?.[cursor.clip]);
    }
  }, [sd, cd, cursor]);
  useEffect(() => {
    setSkippedProgress(0);
  }, [cursor.step]);

  useEffect(() => {
    if (!disableKeyEvent) {
      document.removeEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [disableKeyEvent, stepDuration, clipDuration, pause]);

  const fullscreenHandler = () => {
    const storyContainer = document.getElementById("stories-container");
    if (document.fullscreenElement === null && storyContainer) {
      fscreen.requestFullscreen(storyContainer);
      setFullscreen(true);

      // handle.enter();
    } else {
      // handle.exit();
      fscreen.exitFullscreen(document);
      setFullscreen(false);
    }
  };

  const toggleState = (action: string, bufferAction?: boolean) => {
    setPause(action === "pause");
    setBufferAction(!!bufferAction);
    action === "pause" ? onPause?.() : onPlay?.();
  };

  const previous = (skippedByUser?: boolean) => {
    if (skippedByUser) {
      setResetProgress("all");
    }
    setCursor((prev) => {
      if (prev.step > 0) {
        return { step: prev.step - 1, clip: 0 };
      }
      return { ...prev, clip: 0 };
    });
    onPrevious?.();
  };

  const next = (skippedByUser?: boolean) => {
    if (skippedByUser) {
      if (clipDuration !== stepDuration) {
        setResetProgress("clip");
        setSkippedProgress(
          (cd[cursor.step]
            .slice(0, cursor.clip + 1)
            .reduce((sum, d) => sum + d, 0) *
            100) /
            stepDuration
        );
      } else {
        setResetProgress("all");
      }
    }
    setCursor((prev) => {
      if (prev.step < inputStories.length - 1) {
        if (prev.clip < inputStories[prev.step].length - 1) {
          return { ...prev, clip: prev.clip + 1 };
        } else {
          return { step: prev.step + 1, clip: 0 };
        }
      } else if (prev.clip < inputStories[prev.step].length - 1) {
        return { ...prev, clip: prev.clip + 1 };
      }
      !loop && onAllStoriesEnd?.();
      return loop ? { step: 0, clip: 0 } : prev;
    });
    onNext?.();
    onStoryEnd?.();
  };

  const { stepProgress } = useProgress({
    cursor,
    pause,
    loaded,
    stepDuration,
    clipDuration,
    next,
    skippedProgress,
    resetProgress,
    onProgressReset: () => {
      setResetProgress(null);
    },
  });

  const debouncePause = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    touchId.current = setTimeout(() => {
      toggleState("pause");
    }, 200);
  };

  const mouseUp =
    (type: string) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      touchId.current && clearTimeout(touchId.current);
      if (pause) {
        toggleState("play");
      } else {
        type === "next" ? next(true) : previous(true);
      }
    };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "ArrowLeft") {
      previous(true);
    } else if (e.key === "ArrowRight") {
      next(true);
    } else if (e.key === " ") {
      e.preventDefault();
      toggleState(pause ? "play" : "pause");
    }
  };

  return {
    cursor,
    fullscreen,
    Content,
    contentProps: {
      loader,
      stories,
      inputStories,
      loaded,
      setLoaded,
      cursor,
      toggleState,
      stepDuration,
      clipDuration,
      pause,
      isMuted,
      fullscreen,
      stepProgress,
      debouncePause,
      mouseUp,
      next,
      previous,
      fullscreenHandler,
      disableTouchEvent,
      firstLoad,
      setFirstLoad,
      styles,
      icons,
    },
    progressArray: inputStories.map((_, i) =>
      i === cursor.step ? stepProgress : i < cursor.step ? 100 : 0
    ),
  };
};
export const Content: FC<any> = ({
  loader,
  stories,
  inputStories,
  loaded,
  setLoaded,
  cursor,
  toggleState,
  stepDuration,
  clipDuration,
  pause,
  isMuted,
  fullscreen,
  stepProgress,
  debouncePause,
  mouseUp,
  next,
  previous,
  fullscreenHandler,
  disableTouchEvent,
  firstLoad,
  setFirstLoad,
  styles,
  icons,
}) => {
  const VideoRenderer = stories[cursor.step]?.[cursor.clip];
  return (
    // <FullScreen handle={handle}>
    <div
      id="stories-container"
      style={{ ...defaultContainerStyles, ...styles?.container }}
    >
      <StoriesContext.Provider
        value={{
          loader,
          stories: inputStories,
          loaded,
          setLoaded,
          cursor,
          action: toggleState,
          pause,
          isMuted,
          fullscreen,
          next,
          previous,
          fullscreenHandler,
          firstLoad,
          setFirstLoad,
          styles,
          icons,
        }}
      >
        {VideoRenderer && <VideoRenderer />}
      </StoriesContext.Provider>
      {!disableTouchEvent && (
        <div style={touchControlContainerStyles}>
          <div
            style={{ width: "30%", zIndex: 999 }}
            onTouchStart={debouncePause}
            onTouchEnd={mouseUp("previous")}
            onMouseDown={debouncePause}
            onMouseUp={mouseUp("previous")}
          />
          <div
            style={{ width: "70%", zIndex: 999 }}
            onTouchStart={debouncePause}
            onTouchEnd={mouseUp("next")}
            onMouseDown={debouncePause}
            onMouseUp={mouseUp("next")}
          />
        </div>
      )}
    </div>
    // </FullScreen>
  );
};

const defaultContainerStyles: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
};

const touchControlContainerStyles: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  width: "100%",
  height: "100%",
};

export default useContainer;
