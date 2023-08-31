import React, { FC, useEffect, useRef, useState } from "react";
import { GlobalProps } from "../interfaces";
import { Cursor, Story } from "../types";
import usePrefetch from "../hooks/usePrefetch";

const Container: FC<GlobalProps> = ({
  stories: inputStories,
  loader,
  loop,
  isPaused,
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
  const [stories, setStories] = useState<Story[][]>(inputStories);
  const [cursor, setCursor] = useState<Cursor>({ step: 0, clip: 0 });
  const [clipDuration, setClipDuration] = useState<number>(0);
  const [stepDuration, setStepDuration] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [bufferAction, setBufferAction] = useState<boolean>(true);

  //   refs
  const touchId = useRef<any>();

  const { sd, forStep } = usePrefetch(stories, cursor);

  useEffect(() => {
    console.log("SD: ", sd); //TODO: remove log
  }, [sd]);

  const toggleState = (action: string, bufferAction?: boolean) => {
    setPause(action === "pause");
    setBufferAction(!!bufferAction);
  };

  const previous = (skippedByUser?: boolean) => {
    setCursor((prev) => {
      if (prev.step > 0) {
        return { step: prev.step - 1, clip: 0 };
      }
      return { ...prev, clip: 0 };
    });
  };

  const next = (skippedByUser?: boolean) => {
    setCursor((prev) => {
      if (prev.step < stories.length - 1) {
        if (prev.clip < stories[prev.step].length - 1) {
          return { ...prev, clip: prev.clip + 1 };
        } else {
          return { step: prev.step + 1, clip: 0 };
        }
      } else if (prev.clip < stories[prev.step].length - 1) {
        return { ...prev, clip: prev.clip + 1 };
      }
      return loop ? { step: 0, clip: 0 } : prev;
    });
  };

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

  return (
    <div>
      <div>STEP DURATION: {sd}</div>
      {/* <div>CLIP DURATION: {cd}</div> */}
    </div>
  );
};

export default Container;
