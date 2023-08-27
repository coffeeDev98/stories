import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Video from "./components/renderers/Video";
import ProgressContext from "./context/Progress";
import StoriesContext from "./context/Stories";
import ProgressArray from "./components/ProgressArray";
import { Story } from "./interfaces";
import usePrefetch from "./hooks/usePrefetch";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Maybe } from "./types";

type Props = {};

const testData = [
  [
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape1.mp4",
      type: "video",
    },
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape7.mp4",
      type: "video",
    },
  ],
  [
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape2.mp4",
      type: "video",
    },
  ],
  [
    {
      url: "https://static.pixical.com/videos/cooking/Alla%20Gricia/Alla%20Gricia%20-%20Cook%20Pasta%20-%20Landscape3.mp4",
      type: "video",
    },
    {
      url: "https://static.pixical.com/videos/cooking/Alla+Gricia/Alla+Gricia+-+Cook+Pasta+-+Landscape6.mp4",
      type: "video",
    },
  ],
];

const getStepDuration = async (step: any[], stepId: number) => {
  const clipPromises = step.map((clip: any, idx: number) => {
    return new Promise(function (resolve, reject) {
      if (!clip.url) return;
      const video = document.createElement("video");
      video.id = `${stepId}.${idx}`;
      video.src = clip.url;
      video.onloadeddata = () => resolve(video.duration);
      video.onerror = reject;
      return;
    });
  });

  let sum = 0;
  await Promise.all(clipPromises).then((values) => {
    values.forEach((v: any) => {
      sum += v;
    });
  });
  return sum;
};

const App = (props: Props) => {
  const storyClips: Story[][] = testData;
  const [stories, setStories] = useState<any>([]);
  const [stepDuration, setStepDuration] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<number>(0);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<{ step: number; clip: number }>({
    step: 0,
    clip: 0,
  });
  const [skippedProgress, setSkippedProgress] = useState<number>(0);
  // keyboard handler
  const [disableKeyEvent, setDisableKeyEvent] = useState<boolean>(false);
  const [resetProgress, setResetProgress] =
    useState<Maybe<"all" | "step" | "clip">>();
  const touchId = useRef<any>();

  const fsHandle = useFullScreenHandle();

  const [loaded, setLoaded] = useState<boolean>(false);

  const { forStep, sd, cd, setSd } = usePrefetch(
    storyClips,
    currentId,
    setLoaded
  );

  // useEffect(() => {
  //   console.log("SD: ", sd, cd);
  // }, [sd, cd]);

  useEffect(() => {
    console.log(
      `loaded => %c${loaded}%c,  pause => %c${pause}%c,  stepDuration => %c${stepDuration}%c,  clipDuration => %c${clipDuration}%c, currentId => %c${currentId.step},${currentId.clip}%c,  forStep => %c${forStep}%c,  sd => %c${sd}%c`,
      "color: cornflowerblue",
      "color: white",
      "color: cornflowerblue",
      "color: white",
      "color: cornflowerblue",
      "color: white",
      "color: cornflowerblue",
      "color: white",
      "color: cornflowerblue",
      "color: white",
      "color: cornflowerblue",
      "color: white",
      "color: cornflowerblue",
      "color: white"
    );
    // console.table({ loaded, pause, stepDuration, clipDuration, forStep, sd });
  }, [loaded, pause, stepDuration, clipDuration, forStep, sd, currentId]);

  useEffect(() => {
    setStories(() => {
      const temp = storyClips.map((step: any, index) => {
        return step.map((clip: any, idx: number) => {
          return Video({ step: index, clip: idx });
        });
      });
      return temp;
    });
  }, []);

  useLayoutEffect(() => {
    setLoaded(false);
  }, [currentId]);

  // useLayoutEffect(() => {
  //   if (currentId.step === storyClips.length - 1) return;
  //   setSd([]);
  // }, [currentId.step]);

  useEffect(() => {
    // setStepDuration(0);
    // setClipDuration(0);

    if (forStep && currentId.step === forStep) {
      setStepDuration(sd * 1000);
      if (currentId.step === storyClips.length - 1) return;
      setSd([]);
      return;
    }
    setSkippedProgress(0);
    getStepDuration(storyClips[currentId.step], currentId.step).then((d) => {
      setStepDuration(d * 1000);
      setLoaded(true);
    });
  }, [currentId.step]);

  useEffect(() => {
    if (!disableKeyEvent) {
      document.removeEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [disableKeyEvent, stepDuration, clipDuration]);

  const action = (action: "pause" | "play") => {
    setPause(() => action === "pause");
  };

  const togglePause = (forceState?: boolean) => {
    setPause((prev) => {
      return forceState ? forceState : !prev;
    });
  };

  const previous = (skippedByUser?: boolean) => {
    if (skippedByUser) {
      setResetProgress("all");
    }
    setCurrentId((prev) => {
      if (prev.step > 0) {
        return { step: prev.step - 1, clip: 0 };
      }
      return { ...prev, clip: 0 };
    });
  };

  const next = (skippedByUser?: boolean) => {
    if (skippedByUser) {
      if (clipDuration !== stepDuration) {
        console.log("SETTING_SKIPPED");
        setResetProgress("clip");
        setSkippedProgress((clipDuration * 100) / stepDuration);
      } else {
        setResetProgress("all");
      }
    }
    setCurrentId((prev) => {
      console.log("PREV_CURSOR: ", prev);
      if (prev.step < storyClips.length - 1) {
        if (prev.clip < storyClips[prev.step].length - 1) {
          return { ...prev, clip: prev.clip + 1 };
        } else {
          return { step: prev.step + 1, clip: 0 };
        }
      } else if (prev.clip < storyClips[prev.step].length - 1) {
        return { ...prev, clip: prev.clip + 1 };
      }
      return { step: 0, clip: 0 };
    });
  };

  const debouncePause = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    touchId.current = setTimeout(() => {
      togglePause(true);
    }, 200);
  };

  const mouseUp =
    (type: string) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      touchId.current && clearTimeout(touchId.current);
      if (pause) {
        togglePause(false);
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
      togglePause();
    }
  };

  const CurrentVideo = stories?.[currentId.step]?.[currentId.clip];
  return (
    <div style={{ position: "relative", height: "max-content" }}>
      <StoriesContext.Provider
        value={{
          stories: storyClips,
          loaded,
          setLoaded,
          cursor: currentId,
        }}
      >
        <ProgressContext.Provider
          value={{
            currentId,
            stepDuration,
            clipDuration,
            pause,
            togglePause,
            previous,
            next,
            skippedProgress: skippedProgress,
            resetProgress: resetProgress,
            onProgressReset: () => {
              setResetProgress(null);
            },
          }}
        >
          {/* <ProgressArray /> */}
          {clipDuration && stepDuration ? <ProgressArray /> : null}
        </ProgressContext.Provider>
        <FullScreen handle={fsHandle}>
          {CurrentVideo && (
            <CurrentVideo
              story={storyClips[currentId.step][currentId.clip]}
              getClipDuration={(cd: any) => {
                setClipDuration(cd * 1000);
                // clipDuration.current = cd * 1000;
                // setLoaded(true);
              }}
              isPaused={pause}
              action={action}
              //   onEnded={() => {
              //     next();
              //   }}
            />
          )}
        </FullScreen>
      </StoriesContext.Provider>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{ width: "50%", zIndex: 999 }}
          onTouchStart={debouncePause}
          onTouchEnd={mouseUp("previous")}
          onMouseDown={debouncePause}
          onMouseUp={mouseUp("previous")}
        />
        <div
          style={{ width: "50%", zIndex: 999 }}
          onTouchStart={debouncePause}
          onTouchEnd={mouseUp("next")}
          onMouseDown={debouncePause}
          onMouseUp={mouseUp("next")}
        />
      </div>
    </div>
  );
};

export default App;
