import React, { useContext, useEffect, useRef, useState } from "react";
import { ProgressContext, StoriesContext } from "../interfaces";
import ProgressCtx from "../context/Progress";
import StoriesCtx from "../context/Stories";
import { timestamp } from "./time";

type Props = {};

const ProgressArray = (props: Props) => {
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [clipProgress, setClipProgress] = useState<number>(0);
  const lastTime = useRef<number>();

  let animationFrameId = useRef<number>(-1);

  const {
    currentId,
    stepDuration,
    clipDuration,
    setClipDuration,
    pause,
    next,
  } = useContext<ProgressContext>(ProgressCtx);
  const { loaded, setLoaded } = React.useContext<StoriesContext>(StoriesCtx);

  useEffect(() => {
    setStepProgress(0);
  }, [currentId.step, stepDuration]);
  useEffect(() => {
    setClipProgress(0);
  }, [currentId.clip, clipDuration]);

  useEffect(() => {
    if (!pause && loaded) {
      console.log("STARTING PROGRESS");
      animationFrameId.current = requestAnimationFrame(incrementCount);
      lastTime.current = timestamp();
    }
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [currentId.step, pause, stepDuration, loaded]);

  let stepProgressCopy = stepProgress;
  let clipProgressCopy = clipProgress;
  const incrementCount = () => {
    // if (countCopy === 0) storyStartCallback();
    if (lastTime.current == undefined) lastTime.current = timestamp();
    const t = timestamp();
    const dt = t - lastTime.current;
    lastTime.current = t;
    setStepProgress((count: number) => {
      const stepInterval = stepDuration;
      if (stepInterval > 0) {
        stepProgressCopy = count + (dt * 100) / stepInterval;
        if (stepProgressCopy < 100) {
          animationFrameId.current = requestAnimationFrame(incrementCount);
        } else {
          //   storyEndCallback();
          cancelAnimationFrame(animationFrameId.current);

          // console.log("CHANGING_STEP_CLIP: ", stepProgressCopy, stepDuration);
          setClipDuration(0);
          next();
        }
      }
      return stepProgressCopy;
    });

    //   clip progress
    setClipProgress((count: number) => {
      const clipInterval = clipDuration;
      if (clipInterval > 0) {
        clipProgressCopy = count + (dt * 100) / clipInterval;
        console.log("COUNT_COPY: ", clipProgressCopy, clipDuration);

        if (clipProgressCopy >= 100) {
          // console.log("CHANGING_STEP_CLIP: ", clipProgressCopy, clipDuration);
          setClipDuration(0);
          next();
        }
      }
      return clipProgressCopy;
    });
  };

  const getCurrentInterval = () => {
    // if (stories[currentId].type === "video")
    return stepDuration;
    // if (typeof stories[currentId].duration === "number")
    //   return stories[currentId].duration;
    // return defaultInterval;
  };

  return (
    <div
      style={{
        height: 1,
        width: `${stepProgress}%`,
        background: "black",
        marginBottom: 10,
      }}
    ></div>
  );
};

export default ProgressArray;
