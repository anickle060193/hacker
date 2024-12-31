import React from "react";

export function useInterval(
  enabled: boolean,
  intervalTime: number,
  callback: () => void
): void {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      callbackRef.current();
    }, intervalTime);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, intervalTime]);
}
