import React, { useContext, useEffect, useRef } from "react";
import { StoriesContext } from "../interfaces";
import StoriesCtx from "../context/Stories";
import { RippleLoader } from "./RippleLoader";

type Props = {};

const Video = (metadata: any) => (props: Props) => {
  const ref = useRef<HTMLVideoElement | null>(null);

  const { action, stories, cursor, loaded, setLoaded, pause, muted, setMuted } =
    useContext<StoriesContext>(StoriesCtx);

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
    setLoaded(false);
    action("pause");
  };

  const onPlaying = () => {
    setLoaded(true);
    action("play");
  };

  const videoLoaded = () => {
    // getClipDuration(vid.current?.duration);
    // console.log("VID: ", vid.current);
    ref?.current
      ?.play()
      .then(() => {
        action("play");
      })
      .catch(() => {
        setLoaded(false);
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
            action("pause");
          });
        // .finally(() => {
        //   // setMuted(false);
        //   action("play");
        // });
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
