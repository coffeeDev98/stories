import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Video from "./components/renderers/Video";
import ProgressContext from "./context/Progress";
import StoriesContext from "./context/Stories";
import ProgressArray from "./components/ProgressArray";
import { Story } from "./interfaces";
import usePrefetch from "./hooks/usePrefetch";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

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

  const fsHandle = useFullScreenHandle();

  const [loaded, setLoaded] = useState<boolean>(false);

  usePrefetch(storyClips, currentId);

  useLayoutEffect(() => {
    // setLoaded(false);
  }, [currentId]);

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
  useEffect(() => {
    setStepDuration(0);
    setClipDuration(0);
    getStepDuration(storyClips[currentId.step], currentId.step).then((d) => {
      setStepDuration(d * 1000);
    });
  }, [currentId.step]);

  const action = (action: "pause" | "play") => {
    setPause(() => action === "pause");
  };

  const togglePause = (forceState?: boolean) => {
    setPause((prev) => {
      return forceState ? forceState : !prev;
    });
  };

  const next = () => {
    setCurrentId((prev) => {
      if (prev.step < storyClips.length - 1) {
        if (prev.clip < storyClips[prev.step].length - 1) {
          return { ...prev, clip: prev.clip + 1 };
        } else {
          return { step: prev.step + 1, clip: 0 };
        }
      } else if (prev.clip < storyClips[prev.step].length - 1) {
        return { ...prev, clip: prev.clip + 1 };
      } else {
        return { step: 0, clip: 0 };
      }
      return prev;
    });
  };
  const previous = () => {
    setCurrentId((prev) => {
      if (prev.step > 0) {
        return { step: prev.step - 1, clip: 0 };
      }
      return { ...prev, clip: 0 };
    });
  };

  const CurrentVideo = stories?.[currentId.step]?.[currentId.clip];
  return (
    <div>
      <StoriesContext.Provider
        value={{
          loaded,
          setLoaded,
          cursor: currentId,
        }}
      >
        {clipDuration && stepDuration ? (
          <ProgressContext.Provider
            value={{
              currentId,
              stepDuration,
              clipDuration,
              pause,
              togglePause,
              previous,
              next,
            }}
          >
            <ProgressArray />
          </ProgressContext.Provider>
        ) : null}
        <FullScreen handle={fsHandle}>
          {CurrentVideo && (
            <CurrentVideo
              story={storyClips[currentId.step][currentId.clip]}
              getClipDuration={(cd: any) => {
                setClipDuration(cd * 1000);
                // clipDuration.current = cd * 1000;
                setLoaded(true);
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
    </div>
  );
};

export default App;
