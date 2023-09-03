import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { GlobalProps } from "../interfaces";
import { Cursor, Maybe, Story } from "../types";
import usePrefetch from "./usePrefetch";
import StoriesContext from "../context/Stories";
import Video from "../components/Video";
import useProgress from "./useProgress";

const useContainer: (props: GlobalProps) => {
  Content: any;
  contentProps: any;
  progressArray: any[];
} = ({
  stories: inputStories,
  loader,
  loop,
  isPaused,
  isMuted,
  onAllStoriesEnd,
  onStoryStart,
  onStoryEnd,
  onPrevious,
  onNext,
  keyboardNavigation,
  touchNavigation,
  preloadCount,
  styles,
}) => {
  const [stories, setStories] = useState<any[][]>([]);
  const [cursor, setCursor] = useState<Cursor>({ step: 0, clip: 0 });
  const [clipDuration, setClipDuration] = useState<number>(0);
  const [stepDuration, setStepDuration] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [bufferAction, setBufferAction] = useState<boolean>(true);
  const [skippedProgress, setSkippedProgress] = useState<number>(0);
  const [resetProgress, setResetProgress] =
    useState<Maybe<"all" | "step" | "clip">>();

  // keyboard handler
  const [disableKeyEvent, setDisableKeyEvent] = useState<boolean>(false);

  //   refs
  const touchId = useRef<any>();

  const { sd, cd, loaded, setLoaded, forStep } = usePrefetch(
    inputStories,
    cursor
  );

  useEffect(() => {
    if (typeof isPaused === "boolean") setPause(isPaused);
  }, [isPaused]);

  useEffect(() => {
    if (typeof isMuted === "boolean") setPause(isMuted);
  }, [isMuted]);

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
    if (cd.length > 0 && sd.length > 0) {
      // console.log({ cursor, cd, sd });
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

  const toggleState = (action: string, bufferAction?: boolean) => {
    setPause(action === "pause");
    setBufferAction(!!bufferAction);
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
  };

  const next = (skippedByUser?: boolean) => {
    if (skippedByUser) {
      if (clipDuration !== stepDuration) {
        console.log("SETTING_SKIPPED => ", cd);
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
      return loop ? { step: 0, clip: 0 } : prev;
    });
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
    Content,
    contentProps: {
      stories,
      inputStories,
      loaded,
      setLoaded,
      cursor,
      toggleState,
      stepDuration,
      clipDuration,
      styles,
      pause,
      muted,
      setMuted,
      stepProgress,
    },
    progressArray: inputStories.map((_, i) =>
      i === cursor.step ? stepProgress : i < cursor.step ? 100 : 0
    ),
  };
};
export const Content: FC<any> = ({
  stories,
  inputStories,
  loaded,
  setLoaded,
  cursor,
  toggleState,
  stepDuration,
  clipDuration,
  styles,
  pause,
  muted,
  setMuted,
  stepProgress,
}) => {
  const VideoRenderer = stories[cursor.step]?.[cursor.clip];
  return (
    <div style={{ ...styles?.container }}>
      <StoriesContext.Provider
        value={{
          stories: inputStories,
          loaded,
          setLoaded,
          cursor,
          action: toggleState,
          pause,
          muted,
          setMuted,
        }}
      >
        {VideoRenderer && <VideoRenderer />}
      </StoriesContext.Provider>
    </div>
  );
};

export default useContainer;
