import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ProgressContext, StoriesContext } from "../interfaces";
import ProgressCtx from "../context/Progress";
import StoriesCtx from "../context/Stories";
import { timestamp } from "./time";
import Progress from "./Progress";

type Props = {};

const ProgressArray = (props: Props) => {
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [clipProgress, setClipProgress] = useState<number>(0);
  const lastTime = useRef<number>();
  const sd = useRef<number>(0);
  const cd = useRef<number>(0);
  const p = useRef<boolean>(true);
  const l = useRef<boolean>(false);

  const animationFrameId = useRef<number>(-1);

  const {
    currentId,
    stepDuration,
    clipDuration,
    pause,
    togglePause,
    previous,
    next,
    skippedProgress,
    resetProgress,
    onProgressReset,
  } = useContext<ProgressContext>(ProgressCtx);
  const { stories, loaded, setLoaded } =
    React.useContext<StoriesContext>(StoriesCtx);

  l.current = loaded;
  p.current = pause;
  sd.current = stepDuration;
  cd.current = clipDuration;

  useEffect(() => {
    reset("all");
  }, [currentId.step, stepDuration]);
  useEffect(() => {
    reset("clip");
  }, [currentId.clip, clipDuration]);
  useEffect(() => {
    if (!resetProgress || !onProgressReset) return;
    reset(resetProgress);
    onProgressReset();
  }, [resetProgress]);
  useEffect(() => {
    if (skippedProgress && skippedProgress > 0)
      setStepProgress(skippedProgress);
  }, [skippedProgress]);

  useEffect(() => {
    if (!l.current) return;
    if (l.current) {
      if (!p.current && sd.current && cd.current) {
        animationFrameId.current = requestAnimationFrame(incrementCount);
        lastTime.current = timestamp();
      }
    }
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [currentId.step, p.current, l.current, sd.current, cd.current]);

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
    // if (countCopy === 0) storyStartCallback();
    // if (!p.current) {
    if (!l.current || p.current) {
      cancelAnimationFrame(animationFrameId.current);
      return;
    }
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
    // } else {
    //   cancelAnimationFrame(animationFrameId.current);
    // }
  };

  const opacityStyles = {
    opacity: pause ? 0 : 1,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        maxWidth: "100%",
        flexWrap: "nowrap" as const,
        position: "absolute" as const,
        width: "98%",
        padding: 5,
        paddingTop: 7,
        alignSelf: "center",
        zIndex: 1001,
        filter: "drop-shadow(0 1px 8px #222)",
        transition: "opacity 400ms ease-in-out",
        // ...opacityStyles,
      }}
    >
      {stories.map((_, i) => (
        <Progress
          key={i}
          width={1 / stories.length}
          count={stepProgress}
          active={i === currentId.step ? 1 : i < currentId.step ? 2 : 0}
        />
      ))}
    </div>
  );
};

export default ProgressArray;
