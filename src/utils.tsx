export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const isMobile = () => window.innerWidth < 768;

export const conver2Dto1DIndex = (arr: any[][], x: number, y: number) => {
  let idx = 0;
  for (let i = 0; i < x; ++i) {
    idx += arr[i].length;
  }
  idx += y;
  return idx;
};
