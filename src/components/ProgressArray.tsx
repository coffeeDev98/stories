import React, { useContext, useEffect, useRef, useState } from "react";
import { ProgressContext, StoriesContext } from "../interfaces";
import ProgressCtx from "../context/Progress";
import StoriesCtx from "../context/Stories";
import { timestamp } from "./time";

type Props = {};

const ProgressArray = (props: Props) => {
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [clipProgress, setClipProgress] = useState<number>(0);
  const [disableKeyEvent, setDisableKeyEvent] = useState<boolean>(false);
  const lastTime = useRef<number>();
  const sd = useRef<number>(0);
  const cd = useRef<number>(0);
  const p = useRef<boolean>();

  const animationFrameId = useRef<number>(-1);

  const {
    currentId,
    stepDuration,
    clipDuration,
    pause,
    togglePause,
    previous,
    next,
  } = useContext<ProgressContext>(ProgressCtx);
  const { loaded, setLoaded } = React.useContext<StoriesContext>(StoriesCtx);

  p.current = pause;
  sd.current = stepDuration;
  cd.current = clipDuration;

  useEffect(() => {
    reset();
  }, [currentId.step, stepDuration]);
  useEffect(() => {
    reset("clip");
  }, [currentId.clip, clipDuration]);

  useEffect(() => {
    if (loaded) {
      if (!pause && sd.current && cd.current) {
        animationFrameId.current = requestAnimationFrame(incrementCount);
        lastTime.current = timestamp();
      }
    }
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [currentId.step, pause, loaded, sd.current, cd.current]);

  useEffect(() => {
    if (!disableKeyEvent) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [disableKeyEvent]);

  const reset = (only?: "step" | "clip") => {
    if (only) {
      only === "step" ? setStepProgress(0) : setClipProgress(0);
    } else {
      setStepProgress(0);
      setClipProgress(0);
    }
  };

  let stepProgressCopy = stepProgress;
  let clipProgressCopy = clipProgress;
  const incrementCount = () => {
    // if (countCopy === 0) storyStartCallback();
    if (!p.current) {
      if (lastTime.current == undefined) lastTime.current = timestamp();
      const t = timestamp();
      const dt = t - lastTime.current;
      lastTime.current = t;
      const clipInterval = cd.current;
      const stepInterval = sd.current;

      //   clip progress
      setClipProgress((prevCount: number) => {
        clipProgressCopy = prevCount + (dt * 100) / clipInterval;
        return clipProgressCopy;
      });

      if (clipProgressCopy >= 100) {
        cancelAnimationFrame(animationFrameId.current);
        lastTime.current = t;
        next();
      }

      // step progress
      setStepProgress((prevCount: number) => {
        stepProgressCopy = prevCount + (dt * 100) / stepInterval;
        return stepProgressCopy;
      });
      if (stepProgressCopy < 100) {
        animationFrameId.current = requestAnimationFrame(incrementCount);
      } else {
        //   storyEndCallback();
        cancelAnimationFrame(animationFrameId.current);
        next();
      }
    } else {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "ArrowLeft") {
      reset();
      previous();
    } else if (e.key === "ArrowRight") {
      cd.current !== sd.current &&
        setStepProgress((cd.current * 100) / sd.current);
      next();
    } else if (e.key === " ") {
      e.preventDefault();
      togglePause();
    }
  };

  return (
    <div
      style={{
        height: 1,
        width: `${stepProgress}%`,
        background: "black",
        marginBottom: 10,
      }}
    />
  );
};

export default ProgressArray;
