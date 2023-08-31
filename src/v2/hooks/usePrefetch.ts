import { useEffect, useLayoutEffect, useState } from "react";
import { Story } from "../types";
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
        // let blobUrl = URL.createObjectURL(xhr.response);
        // if (isMobile() || isSafari()) {
        navigator?.serviceWorker?.ready.then((reg) => {
          if (reg.active) {
            reg.active.postMessage({ source: url, blob: xhr.response });
            onPrefetch(url);
          }
        });
        // } else {
        //   fetchedCallback(blobUrl, ref);
        //   onPrefetch(url);
        // }
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
  console.log("CACHING_FOR: ", contents); //TODO: remove log
  const promises = contents.map((content) => {
    return new Promise((resolve, reject) => {
      if (!content.url) return;

      try {
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          console.log("PREFETCH_METADATA"); //TODO: remove log
        };
        video.onloadeddata = () => {
          console.log("prefetched video => ", video.duration); //TODO: remove log
          return resolve({ url: content.url, duration: video.duration });
        };
        video.onerror = reject;
        video.src = content.url;
      } catch (err) {
        console.log("prefetch caching error => ", err); //TODO: remove log
      }
      return;
    });
  });

  return await Promise.all(promises);
};

const usePrefetch = (
  storyClips: Story[][],
  cursor: { step: number; clip: number }
  //   setLoaded: React.Dispatch<React.SetStateAction<boolean>>
): { sd: number[]; forStep?: number } => {
  const [prefetched, setPrefetched] = useState<string[]>([]);
  const { step, clip } = cursor;
  const [cd, setCd] = useState<number[][]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    console.log("PREFETCH_CD => ", cd); //TODO: remove log
  }, [cd]);

  useLayoutEffect(() => {
    // const flatIndex = conver2Dto1DIndex(storyClips, step, clip);
    if (step < storyClips.length) {
      storyClips.slice(step, step + 2).forEach((story: Story[], index) => {
        cacheContent(story.filter((meta) => !prefetched.includes(meta.url)))
          .then((c: Array<any>) => {
            const temp: number[][] = cd;
            temp[storyClips.findIndex((s) => s[0].url === c[0].url)] = c.map(
              (item) => item.duration
            );
            console.log("prefetch temp => ", temp); //TODO: remove log
            setCd(temp);
            setPrefetched(c.map((item) => item.url));
          })
          .catch((err) => {
            console.log("prefetch error => ", err); //TODO: remove log
          });
      });
    }
    setLoaded(() => {
      return true;
    });

    // const el = document.getElementById(`clip-${step}.${clip}`);
    // if (el) {
    // if (step + 1 < storyClips.length) {
    //   storyClips[step + 1].map((c: Story) => {
    //     if (prefetched?.includes(c.url)) {
    //       console.log("SKIPPING_PREFETCH"); //TODO: remove log
    //       return;
    //     }
    //     prefetch(
    //       null, //el as HTMLVideoElement,
    //       c.url,
    //       () => {},
    //       (url: string) => {
    //         setPrefetched((prev) => [...prev, url]);
    //         // setLoaded(true);
    //       }
    //     );
    //   });
    // }
    // }
  }, [storyClips, cursor.step]);

  return {
    sd: cd.map((c) => c.reduce((sum, d) => sum + d, 0)),
    ...(cd.length > 0 && {
      forStep: step + 1 < storyClips.length ? step + 1 : step,
    }),
  };
};
export default usePrefetch;
