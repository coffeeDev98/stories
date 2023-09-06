import { useEffect, useLayoutEffect, useState } from "react";
import { Story } from "../types";

const cacheContent = async (contents: Story[]) => {
  const URL = window.URL || window.webkitURL;
  const promises = contents.map((content) => {
    const video = document.createElement("video");
    return new Promise((resolve, reject) => {
      if (!content.url) return;
      try {
        fetch(content.url)
          .then((response) => response.blob())
          .then((blob) => {
            video.src = URL.createObjectURL(blob);

            navigator?.serviceWorker?.ready.then((reg) => {
              if (reg.active) {
                reg.active.postMessage({ source: content.url, blob: blob });
                return resolve({
                  url: content.url,
                  duration: content.duration * 1000,
                });
              }
            });
          });
        video.onloadedmetadata = () => {
          return resolve({ url: content.url, duration: video.duration * 1000 });
        };
        video.onerror = reject;
      } catch (err) {
        console.log("prefetch caching error => ", err); //TODO: remove log
      }
    });
  });

  return await Promise.all(promises);
};

const usePrefetch = (
  storyClips: Story[][],
  cursor: { step: number; clip: number }
  //   setLoaded: React.Dispatch<React.SetStateAction<boolean>>
): {
  sd: number[];
  cd: number[][];
  loaded: boolean;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  forStep?: number;
} => {
  const [prefetched, setPrefetched] = useState<string[]>([]);
  const { step, clip } = cursor;
  const [cd, setCd] = useState<number[][]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (step < storyClips.length) {
      storyClips.slice(step, step + 2).forEach((story: Story[], index) => {
        cacheContent(story.filter((meta) => !prefetched.includes(meta.url)))
          .then((c: Array<any>) => {
            if (c.length === 0) return;
            const temp: number[][] = cd;
            temp[storyClips.findIndex((s) => s[0].url === c[0].url)] = c.map(
              (item) => item.duration
            );
            setCd(temp);
            setPrefetched(c.map((item) => item.url));
            setLoaded(true);
          })
          .catch((err) => {
            console.log("prefetch error => ", err); //TODO: remove log
          });
      });
    }
  }, [storyClips, cursor]);

  useEffect(() => {
    setLoaded(false);
  }, [cursor]);

  return {
    sd: cd.map((c) => c.reduce((sum, d) => sum + d, 0)),
    cd,
    loaded,
    setLoaded,
    ...(cd.length > 0 && {
      forStep: step + 1 < storyClips.length ? step + 1 : step,
    }),
  };
};
export default usePrefetch;
