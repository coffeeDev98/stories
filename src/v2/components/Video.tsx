import React, { useContext, useEffect, useRef, useState } from "react";
import { StoriesContext } from "../interfaces";
import StoriesCtx from "../context/Stories";
import { RippleLoader } from "./RippleLoader";
import { detectBrowser } from "../utils";

type Props = {};

const Video = (metadata: any) => (props: Props) => {
  const [muted, setMuted] = useState<boolean>(false);
  const ref = useRef<HTMLVideoElement | null>(null);

  const { action, stories, cursor, loaded, setLoaded, pause, isMuted } =
    useContext<StoriesContext>(StoriesCtx);

  useEffect(() => {
    if (typeof isMuted === "boolean") setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = 0;
    }
  }, [cursor, ref.current]);

  useEffect(() => {
    if (ref.current && loaded) {
      if (pause) {
        ref.current.pause();
      } else {
        ref.current.play().catch((err) => {
          console.log(`playback error ${cursor.step}.${cursor.clip} => `, err);
        });
      }
    }
  }, [pause, loaded]);

  useEffect(() => {
    loaded && videoLoaded();
  }, [loaded]);

  const onWaiting = () => {
    action("pause");
  };

  const onPlaying = () => {
    setLoaded(true);
    action("play");
    if (detectBrowser() !== "safari") {
      muted && !isMuted && setMuted(false);
    }
  };

  const videoLoaded = () => {
    ref?.current
      ?.play()
      .then(() => {
        action("play");
      })
      .catch(() => {
        setMuted(true);
        ref.current
          ?.play()
          .then(() => {
            action("play");
          })
          .catch((err) => {
            console.log(
              `retry play err ${cursor.step}.${cursor.clip} => `,
              err
            );
          });
      });
  };

  return (
    <div style={{ position: "relative" }}>
      <video
        style={{ width: "100%", aspectRatio: "calc(16/9)" }}
        id={`clip-${metadata?.step}.${metadata?.clip}`}
        ref={ref}
        src={stories[cursor.step][cursor.clip].url}
        webkit-playsinline="true"
        preload="auto"
        muted={muted}
        // muted={true}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
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
