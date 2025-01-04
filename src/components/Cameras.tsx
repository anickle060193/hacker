import React from "react";
import Hls from "hls.js";

const URLS = [
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2089-2-US-54atMaize.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2097-2-US-54atTyler.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2107-2-US-54atMid-ContinentW.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2108-2-US-54atMid-ContinentE.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2116-2-US-54atDugan.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2118-2-US-54atHoover.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2123-2-US-54atI-235.stream/chunklist.m3u8",
  "https://cdn3.wowza.com/5/TkUxaGpnVUNpME1Z/KDOT/5-054-2129-2-US-54atWestSt.stream/chunklist.m3u8",
];

export const Cameras: React.FC = () => {
  const [url] = React.useState(
    () => URLS[Math.floor(Math.random() * URLS.length)]
  );
  const [video, setVideo] = React.useState<HTMLVideoElement | null>(null);
  const [paused, setPaused] = React.useState(true);
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    if (!video || !load) {
      return;
    }
    const vid = video;

    function onPausedChanged() {
      setPaused(vid.paused);
    }

    video.addEventListener("play", onPausedChanged);
    video.addEventListener("pause", onPausedChanged);

    onPausedChanged();

    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(vid);

    return () => {
      video.removeEventListener("play", onPausedChanged);
      video.removeEventListener("pause", onPausedChanged);

      hls.destroy();
    };
  }, [video, load, url]);

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <video
        ref={setVideo}
        css={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale( 100% ) brightness( 50% )",
        }}
        autoPlay={load}
        controls={false}
      />
      <div
        css={(theme) => ({
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `hsl( from ${theme.colors.primary} h s l / 0.2 )`,
          cursor: "pointer",
        })}
        onClick={async () => {
          if (!load) {
            setLoad(true);
          } else if (video) {
            if (video.paused) {
              await video.play();
            } else {
              video.pause();
            }
          }
        }}
      />
      <svg
        css={(theme) => ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate( -50%, -50% )",
          width: "4rem",
          height: "4rem",
          fill: theme.colors.primary,
          pointerEvents: "none",
          transition: "opacity 200ms ease-in-out",
        })}
        style={{
          opacity: paused ? 1 : 0,
        }}
        viewBox="0 0 10 10"
      >
        <path d="M2,2 L7,5 L2,8 z" />
      </svg>
    </div>
  );
};
