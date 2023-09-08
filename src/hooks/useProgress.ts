import { Cursor } from "./../types";
import React, { useEffect, useRef, useState } from "react";
import { timestamp } from "../utils";

type Props = {};

const useProgress: (props: any) => { stepProgress: any } = ({
  cursor,
  pause,
  loaded,
  stepDuration,
  clipDuration,
  next,
  skippedProgress,
  resetProgress,
  onProgressReset,
}) => {
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [clipProgress, setClipProgress] = useState<number>(0);

  //   refs
  const animationFrameId = useRef<number>(-1);
  const lastTime = useRef<number>();

  if (!loaded) {
    cancelAnimationFrame(animationFrameId.current);
  }

  useEffect(() => {
    reset("all");
  }, [cursor.step, stepDuration]);
  useEffect(() => {
    reset("clip");
  }, [cursor.clip, clipDuration]);
  useEffect(() => {
    if (!resetProgress || !onProgressReset) return;
    reset(resetProgress);
    onProgressReset?.();
  }, [resetProgress]);
  useEffect(() => {
    if (typeof skippedProgress === "number") {
      setStepProgress(skippedProgress);
    }
  }, [skippedProgress]);

  useEffect(() => {
    if (!loaded) return;
    if (loaded) {
      if (!pause && stepDuration && clipDuration) {
        animationFrameId.current = requestAnimationFrame(incrementCount);
        lastTime.current = timestamp();
      }
    }
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [cursor.step, pause, loaded, stepDuration, clipDuration]);

  const reset = (mode: "all" | "step" | "clip") => {
    switch (mode) {
      case "step":
        setStepProgress(0);
        break;
      case "clip":
        setClipProgress(0);
        break;
      default:
        setStepProgress(0);
        setClipProgress(0);
        break;
    }
  };

  let stepProgressCopy = stepProgress;
  let clipProgressCopy = clipProgress;

  const incrementCount = () => {
    if (!loaded || pause) {
      cancelAnimationFrame(animationFrameId.current);
      return;
    }

    if (lastTime.current == undefined) lastTime.current = timestamp();
    const t = timestamp();
    const dt = t - lastTime.current;
    lastTime.current = t;
    const clipInterval = clipDuration;
    const stepInterval = stepDuration;

    //   clip progress
    setClipProgress((prevCount: number) => {
      clipProgressCopy = prevCount + (dt * 100) / clipInterval;
      return clipProgressCopy;
    });

    if (clipProgressCopy >= 100) {
      cancelAnimationFrame(animationFrameId.current);
      lastTime.current = t;
      next();
      return;
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
  };

  return {
    stepProgress,
  };
};

export default useProgress;
