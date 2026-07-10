/** @format */

export function isOnline() {
  return navigator.onLine;
}

export function waitForOnline() {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve(true);
      return;
    }
    const handler = () => {
      if (isOnline()) {
        window.removeEventListener("online", handler);
        resolve(true);
      }
    };
    window.addEventListener("online", handler);
  });
}
