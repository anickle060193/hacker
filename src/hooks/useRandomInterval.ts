import React from "react";

export function useRandomInterval(
  enabled: boolean,
  minInterval: number,
  maxInterval: number,
  callback: () => void
) {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    let stop = false;

    let intervalId: number;

    function onInterval() {
      if (stop) {
        return;
      }

      callbackRef.current();

      const time = (maxInterval - minInterval) * Math.random() + minInterval;

      intervalId = window.setTimeout(onInterval, time);
    }

    onInterval();

    return () => {
      stop = true;
      window.clearTimeout(intervalId);
    };
  }, [enabled, minInterval, maxInterval]);
}
