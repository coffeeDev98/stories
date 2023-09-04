export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const isMobile = () => window.innerWidth < 768;

export function timestamp() {
  return window.performance && window.performance.now
    ? window.performance.now()
    : new Date().getTime();
}

export const detectBrowser = () => {
  let userAgent = navigator.userAgent;
  let browser;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browser = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browser = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browser = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browser = "opera";
  } else if (userAgent.match(/edg/i)) {
    browser = "edge";
  } else {
    browser = "No browser detection";
  }

  return browser;
};
