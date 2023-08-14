import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Video from "./components/renderers/Video";
import ProgressContext from "./context/Progress";
import StoriesContext from "./context/Stories";
import ProgressArray from "./components/ProgressArray";
import { Story } from "./interfaces";

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
  //   const promise = new Promise((resolve, reject) => {
  //     stories?.map(async (step: any, index: number) => {
  //       try {
  //         const clipPromises: any[] = [];
  //         step.map((clip: any, idx: number) => {
  //           clipPromises[idx] = new Promise(function (resolve, reject) {
  //             if (!clip.url) return;
  //             const video = document.createElement("video");
  //             video.id = `${index}.${idx}`;
  //             video.src = clip.url;
  //             video.onloadeddata = () => resolve(video);
  //             video.onerror = reject;
  //             return;
  //           });
  //         });
  //         const stepDuration = await Promise.all(clipPromises);
  //         let sum = 0;
  //         stepDuration.forEach((step) => (sum += step.duration));
  //         totalStepDurations[index] = sum;
  //         resolve(totalStepDurations);
  //       } catch (err) {
  //         reject(err);
  //       }
  //     });
  //   });
  //   Promise.all([promise]).then((values) => {
  //     setVideoDurations([...values]);
  //   });
  //   const d = await Promise.all(promises.flat());
  //   setVideoDurations(d);
};

const App = (props: Props) => {
  const storyClips: Story = testData;
  const [stories, setStories] = useState<any>([]);
  const [stepDuration, setStepDuration] = useState<number>(0);
  const [clipDuration, setClipDuration] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<{ step: number; clip: number }>({
    step: 0,
    clip: 0,
  });

  const [disableKeyEvent, setDisableKeyEvent] = useState<boolean>(false);

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!disableKeyEvent) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [disableKeyEvent]);
  useLayoutEffect(() => {
    console.log("CURRENT_ID:", currentId);
    setLoaded(false);
  }, [currentId]);
  useEffect(() => {
    setStories(() => {
      return storyClips.map((step: any, index) => {
        return step.map((clip: any, idx: number) => {
          return Video;
        });
      });
    });
  }, []);
  useEffect(() => {
    getStepDuration(storyClips[currentId.step], currentId.step).then((d) => {
      setStepDuration(d * 1000);
    });
  }, [currentId.step]);
  useEffect(() => {
    console.log("SETTING_LOADED: ", loaded);
  }, [loaded]);

  const action = (action: "pause" | "play") => {
    setPause(() => action === "pause");
  };

  const togglePause = (forceState?: boolean) => {
    setPause((prev) => {
      return forceState ? forceState : !prev;
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "ArrowLeft") {
      previous();
    } else if (e.key === "ArrowRight") {
      next();
    } else if (e.key === " ") {
      e.preventDefault();
      togglePause();
    }
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
      return { step: 0, clip: 0 };
    });
  };

  const CurrentVideo = stories?.[currentId.step]?.[currentId.clip];
  return (
    <div>
      <StoriesContext.Provider
        value={{
          loaded,
          setLoaded,
        }}
      >
        {clipDuration && (
          <ProgressContext.Provider
            value={{
              currentId,
              stepDuration,
              clipDuration,
              pause,
              next,
            }}
          >
            <ProgressArray />
          </ProgressContext.Provider>
        )}
        {CurrentVideo && (
          <CurrentVideo
            story={storyClips[currentId.step][currentId.clip]}
            getClipDuration={(cd: any) => {
              setClipDuration(cd * 1000);
              // setLoaded(true);
            }}
            isPaused={pause}
            action={action}
            //   onEnded={() => {
            //     next();
            //   }}
          />
        )}
      </StoriesContext.Provider>
      {/* {stories.length > 0 &&
        stories?.map((step: any, index: number) => {
          return step.map((Clip: any, idx: number) => {
            //   videoDurations.current[index] = [];
            return (
              <Clip
                story={testData[index][idx]}
                onVideoLoaded={(duration: any) => {
                  // console.log("DURATION: ", index, idx, duration);
                  // videoDurations.current[index][idx] = duration;
                  // setLoaded(true);
                }}
              />
            );
          });
        })} */}
    </div>
  );
};

export default App;
