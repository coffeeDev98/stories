import React, { useEffect, useLayoutEffect } from "react";
import { RippleLoader } from "../RippleLoader";
import { Action, StoriesContext } from "../../interfaces";
import StoriesCtx from "../../context/Stories";

type Props = {
  story: any;
  getClipDuration: any;
  //   onEnded: () => void;
  isPaused: boolean;
  action: Action;
};

const Video = ({
  story,
  getClipDuration,
  //   onEnded,
  isPaused = false,
  action,
}: Props) => {
  // const [loaded, setLoaded] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  let vid = React.useRef<HTMLVideoElement>(null);
  const { loaded, setLoaded } = React.useContext<StoriesContext>(StoriesCtx);

  useEffect(() => {
    console.log("IS_PAUSED: ", isPaused);
    if (vid.current) {
      if (isPaused) {
        vid.current.pause();
      } else {
        vid.current.play().catch((err) => {
          console.log(err);
        });
      }
    }
  }, [isPaused]);
  //   useEffect(() => {
  //     if (vid.current) {
  //       vid.current.addEventListener("loadeddata", (e: any) => {
  //         console.log("WAITING...", e.target?.readyState);
  //       });
  //     }
  //   }, [vid.current]);

  const onWaiting = () => {
    console.log("ON_WAITING");
    action("pause");
  };

  const onPlaying = () => {
    action("play");
  };

  const videoLoaded = () => {
    if (vid.current && !isPaused) {
      getClipDuration(vid.current?.duration);
      setLoaded(true);
      vid.current
        .play()
        .then(() => {
          action("play");
        })
        .catch(() => {
          setMuted(true);
          vid.current?.play().finally(() => {
            action("play");
          });
        });
    }
  };

  return (
    <div style={{}}>
      <video
        style={{ width: "100%" }}
        // id={`clip-${index}.${idx}`}
        ref={vid}
        src={story.url}
        webkit-playsinline="true"
        preload="auto"
        muted={muted}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onLoadedData={videoLoaded}
        onError={(err) => {
          console.log("ON_ERROR:", err);
        }}
        // controls
        playsInline
        autoPlay
      />
      {!loaded && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            background: "rgba(0, 0, 0, 0.9)",
            zIndex: 9,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#ccc",
          }}
        >
          {!loaded && <RippleLoader />}
        </div>
      )}
    </div>
  );
};

export default Video;
