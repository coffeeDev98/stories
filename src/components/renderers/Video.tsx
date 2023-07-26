import React from "react";
import { RippleLoader } from "../RippleLoader";

type Props = {
  story: any;
  getStepAndClipDurations: any;
  onEnded: () => void;
};

const Video = ({ story, getStepAndClipDurations, onEnded }: Props) => {
  const [loaded, setLoaded] = React.useState(false);
  const [muted, setMuted] = React.useState(false);

  let vid = React.useRef<HTMLVideoElement>(null);

  const videoLoaded = () => {
    getStepAndClipDurations(vid.current?.duration);
    setLoaded(true);
    if (vid.current) {
      vid.current
        .play()
        .then(() => {})
        .catch(() => {
          setMuted(true);
          vid.current?.play().finally(() => {});
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
        //   onEnded={handleStoryEnd}
        controls
        playsInline={true}
        autoPlay={false}
        webkit-playsinline="true"
        preload="auto"
        muted={muted}
        onLoadedData={videoLoaded}
        onLoadedMetadata={(e: any) => {
          //   reqAnimationFrame(storyRef.current || []);
        }}
        onEnded={onEnded}
        onError={(err) => {
          console.log("ON_ERROR:", err);
        }}
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
