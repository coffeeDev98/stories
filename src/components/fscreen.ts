const key = {
  fullscreenEnabled: 0,
  fullscreenElement: 1,
  requestFullscreen: 2,
  exitFullscreen: 3,
  fullscreenchange: 4,
  fullscreenerror: 5,
  fullscreen: 6,
};

const webkit = [
  "webkitFullscreenEnabled",
  "webkitFullscreenElement",
  "webkitRequestFullscreen",
  "webkitExitFullscreen",
  "webkitfullscreenchange",
  "webkitfullscreenerror",
  "-webkit-full-screen",
];

const moz = [
  "mozFullScreenEnabled",
  "mozFullScreenElement",
  "mozRequestFullScreen",
  "mozCancelFullScreen",
  "mozfullscreenchange",
  "mozfullscreenerror",
  "-moz-full-screen",
];

const ms = [
  "msFullscreenEnabled",
  "msFullscreenElement",
  "msRequestFullscreen",
  "msExitFullscreen",
  "MSFullscreenChange",
  "MSFullscreenError",
  "-ms-fullscreen",
];

// so it doesn't throw if no window or document
const document =
  typeof window !== "undefined" && typeof window.document !== "undefined"
    ? window.document
    : {};

const vendor =
  ("fullscreenEnabled" in document && Object.keys(key)) ||
  (webkit[0] in document && webkit) ||
  (moz[0] in document && moz) ||
  (ms[0] in document && ms) ||
  [];

// prettier-ignore
export default {
    requestFullscreen: (element:any) => element[vendor[key.requestFullscreen]]?.(),
    requestFullscreenFunction: (element:any) => element[vendor[key.requestFullscreen]],
    get exitFullscreen() { return (document as any)[vendor[key.exitFullscreen]].bind(document); },
    get fullscreenPseudoClass() { return `:${vendor[key.fullscreen]}`; },
    get fullscreenEnabled() { return Boolean((document as any)[vendor[key.fullscreenEnabled]]); },
    get fullscreenElement() { return (document as any)[vendor[key.fullscreenElement]]; },
    get onfullscreenchange() { return (document as any)[`on${vendor[key.fullscreenchange]}`.toLowerCase()]; },
    get onfullscreenerror() { return (document as any)[`on${vendor[key.fullscreenerror]}`.toLowerCase()]; },
  };
