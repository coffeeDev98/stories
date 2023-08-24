import { useEffect, useLayoutEffect, useState } from "react";
import { Story } from "../interfaces";
import { conver2Dto1DIndex, isMobile, isSafari } from "../utils";

const fetchedCallback: (blobUrl: any, ref: HTMLVideoElement | null) => void = (
  blobUrl,
  ref
) => {
  if (ref) {
    ref.src = blobUrl;
  }
};
// Blob prefetch
const prefetch: (
  ref: HTMLVideoElement | null,
  url: string,
  errorCallback: () => void,
  onPrefetch: (url: string) => void
) => void = (ref, url, errorCallback, onPrefetch) => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  let prevProgCount = 0;
  onPrefetch(`${prevProgCount}`);
  xhr.addEventListener("progress", function (event) {
    if (event.lengthComputable) {
      let progCount = Math.round((event.loaded / event.total) * 100);
      if (progCount != prevProgCount) {
        prevProgCount = progCount;
        onPrefetch(`${prevProgCount}`);
      }
    }
  });
  xhr.addEventListener(
    "load",
    () => {
      if (xhr.status === 200) {
        let URL = window.URL || window.webkitURL;
        let blobUrl = URL.createObjectURL(xhr.response);
        if (isMobile() || isSafari()) {
          navigator?.serviceWorker?.ready.then((reg) => {
            if (reg.active) {
              reg.active.postMessage({ source: url, blob: xhr.response });
              onPrefetch(url);
            }
          });
        } else {
          fetchedCallback(blobUrl, ref);
          onPrefetch(url);
        }
      } else {
        errorCallback();
      }
    },
    false
  );
  xhr.send();
};

// Caches given Story[] using HTMLImageElement and HTMLVideoElement
const cacheContent = async (contents: Story[]) => {
  const promises = contents.map((content) => {
    return new Promise((resolve, reject) => {
      if (!content.url) return;

      if (content.type === "video") {
        const video = document.createElement("video");
        video.src = content.url;
        video.onloadeddata = () => resolve(video.duration);
        video.onerror = reject;
        return;
      }
    });
  });

  return await Promise.all(promises);
};

const usePrefetch = (
  storyClips: Story[][],
  cursor: { step: number; clip: number },
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  prefetchCount: number = 2
) => {
  const { step, clip } = cursor;
  const [sd, setSd] = useState<number[]>([]);
  useLayoutEffect(() => {
    const flatIndex = conver2Dto1DIndex(storyClips, step, clip);
    if (step + 1 < storyClips.length) {
      setLoaded(false);

      cacheContent(storyClips[step + 1]).then((duration: any[]) => {
        setSd(duration);
      });
    }
    setLoaded(() => {
      return true;
    });

    // const el = document.getElementById(`clip-${step}.${clip}`);
    // if (el) {
    //   prefetch(
    //     el as HTMLVideoElement,
    //     storyClips[step][clip].url,
    //     () => {
    //     },
    //     (url: string) => {
    //     }
    //   );
    // }
  }, [
    storyClips,
    document.getElementById(`clip-${step}.${clip}`),
    cursor.step,
  ]);

  return {
    sd: sd.reduce((sum, d) => sum + d, 0),
    ...(sd.length > 0 && {
      forStep: step + 1 < storyClips.length ? step + 1 : step,
    }),
    setSd,
    cd: clip < storyClips[step].length ? sd[clip] : sd[0],
  };
};
export default usePrefetch;
