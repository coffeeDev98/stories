import React, { useEffect, useLayoutEffect } from "react";
import { RippleLoader } from "../RippleLoader";
import { Action, StoriesContext } from "../../interfaces";
import StoriesCtx from "../../context/Stories";

type Props = {
  story: any;
  getClipDuration: any;
  isPaused: boolean;
  action: Action;
};

const Video =
  (metadata: any) =>
  ({ story, getClipDuration, isPaused = false, action }: Props) => {
    // const [loaded, setLoaded] = React.useState(false);
    const [muted, setMuted] = React.useState(false);
    let vid = React.useRef<HTMLVideoElement>(null);
    const { cursor, loaded, setLoaded } =
      React.useContext<StoriesContext>(StoriesCtx);

    useEffect(() => {
      if (vid.current) {
        vid.current.currentTime = 0;
      }
    }, [cursor, vid.current]);

    useEffect(() => {
      if (vid.current && loaded) {
        if (isPaused) {
          vid.current.pause();
        } else {
          vid.current.play().catch((err) => {
            console.log("playback error => ", err);
          });
        }
      }
    }, [isPaused, loaded]);
    useEffect(() => {
      loaded && videoLoaded();
    }, [loaded]);

    const onWaiting = () => {
      setLoaded(false);
      // action("pause");
    };

    const onPlaying = () => {
      setLoaded(true);
      action("play");
    };

    const videoLoaded = () => {
      // setLoaded(true);
      // getClipDuration(vid.current?.duration);
      if (!isPaused) {
        vid?.current
          ?.play()
          .then(() => {
            action("play");
          })
          .catch(() => {
            setMuted(true);
            vid.current?.play().finally(() => {
              setMuted(false);
              action("play");
            });
          });
      }
    };

    return (
      <div style={{ position: "relative" }}>
        <video
          style={{ width: "100%" }}
          id={`clip-${metadata?.step}.${metadata?.clip}`}
          ref={vid}
          src={story.url}
          webkit-playsinline="true"
          preload="auto"
          muted={muted}
          onWaiting={onWaiting}
          onPlaying={onPlaying}
          onLoadedMetadata={() => {
            getClipDuration(vid.current?.duration);
          }}
          // onLoadedData={videoLoaded}
          onError={(err) => {
            console.log("video error => ", err);
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
