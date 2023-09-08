import React, { useContext, useEffect, useRef, useState } from "react";
import { StoriesContext } from "../interfaces";
import StoriesCtx from "../context/Stories";
import { RippleLoader } from "./RippleLoader";
import { detectBrowser, detectOS, isMobile } from "../utils";
import { styled } from "styled-components";

type Props = {};

const shouldUnmute = () => {
  return (
    navigator.userActivation.isActive ||
    !["mac-os", "linux"].includes(detectOS() as "linux" | "mac-os" | "windows")
  );
};

const Video = (metadata: any) => (props: Props) => {
  const [muted, setMuted] = useState<boolean>(true);
  const ref = useRef<HTMLVideoElement | null>(null);

  const {
    loader,
    action,
    stories,
    cursor,
    loaded,
    setLoaded,
    pause,
    isMuted,
    fullscreen,
    next,
    previous,
    fullscreenHandler,
    firstLoad,
    setFirstLoad,
    styles,
    icons,
  } = useContext<StoriesContext>(StoriesCtx);

  // useEffect(() => {
  //   if (typeof isMuted === "boolean") setMuted(isMuted);
  // }, [isMuted]);

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
    if (loaded && !pause) {
      videoLoaded();
    }
  }, [loaded, pause]);

  const toggleMute = (force?: boolean) => {
    setMuted((prev) => (typeof force === "boolean" ? force : !prev));
  };

  const onWaiting = () => {
    action("pause");
  };

  const onPlaying = () => {
    // check to avoid NotAllo wedError on mac-os(ios) & linux(android)
    if (shouldUnmute() && firstLoad && !pause) {
      muted && !isMuted && toggleMute(false);
      action("play");
      setFirstLoad(false);
    }
    setLoaded(true);
  };

  const videoLoaded = () => {
    ref?.current
      ?.play()
      .then(() => {
        action("play");
      })
      .catch(() => {
        toggleMute(true);
        ref.current
          ?.play()
          .then(() => {
            toggleMute(shouldUnmute() ? false : true);
            action("play");
            setFirstLoad(false);
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
    <div
      style={{
        position: "relative",
        ...(fullscreen && {
          width: "100%",
          height: "100%",
          ...(isMobile() && { position: "static", top: 0, left: 0 }),
        }),
      }}
    >
      <video
        style={{
          width: "100%",
          height: "100%",
          ...(fullscreen
            ? {
                position: "static",
                zIndex: 99,
                top: 0,
                left: 0,
              }
            : {
                aspectRatio: isMobile() ? "calc(9/16)" : "calc(16/9)",
              }),
        }}
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

      <MediaControl style={{ ...styles?.mediaControls }}>
        <div id="prev" onClick={() => previous(true)}>
          {icons?.prev || "prev"}
        </div>
        <div id="play" onClick={() => action(pause ? "play" : "pause")}>
          {pause ? icons?.play || "play" : icons?.pause || "pause"}
        </div>
        <div id="next" onClick={() => next(true)}>
          {icons?.next || "next"}
        </div>
        <div id="volume" onClick={() => toggleMute()}>
          {muted ? icons?.mute || "unmute" : icons?.unmute || "mute"}
        </div>
        <div id="fullscreen" onClick={() => fullscreenHandler()}>
          {fullscreen
            ? icons?.shrink || "exit fullscreen"
            : icons?.expand || "fullscreen"}
        </div>
      </MediaControl>

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
          {!loaded && (loader || <RippleLoader />)}
        </div>
      )}
    </div>
  );
};

const MediaControl = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  /* width: 100%; */
  z-index: 9999;
  color: white;
  // padding: 10;
  background: black;
  div {
    margin: 0 10px;
  }
`;
export default Video;
