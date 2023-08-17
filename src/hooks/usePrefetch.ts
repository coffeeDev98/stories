import { useEffect } from "react";
import { Story } from "../interfaces";
import { isMobile, isSafari } from "../utils";

const fetchedCallback: (blobUrl: any, ref: HTMLVideoElement | null) => void = (
  blobUrl,
  ref
) => {
  if (ref) {
    ref.src = blobUrl;
  }
};

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

const usePrefetch = (
  storyClips: Story,
  cursor: { step: number; clip: number }
) => {
  const { step, clip } = cursor;
  useEffect(() => {
    const el = document.getElementById(`clip-${step}.${clip}`);
    if (el) {
      prefetch(
        el as HTMLVideoElement,
        storyClips[step][clip].url,
        () => {
          console.log("preload error");
        },
        (url: string) => {
          console.log("prefetched: ", url);
        }
      );
    }
  }, [storyClips, document.getElementById(`clip-${step}.${clip}`), cursor]);
};
export default usePrefetch;
