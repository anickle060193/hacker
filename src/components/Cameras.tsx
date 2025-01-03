import React from "react";
import Hls from "hls.js";

import { Cell, CellProps } from "./Cell";

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

export const Cameras: React.FC<CellProps> = ({ ...cellProps }) => {
  const [url] = React.useState(
    () => URLS[Math.floor(Math.random() * URLS.length)]
  );
  const [video, setVideo] = React.useState<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    if (!video) {
      return;
    }

    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);

    return () => {
      hls.destroy();
    };
  }, [video, url]);

  return (
    <Cell {...cellProps}>
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
            filter: "contrast( 200% ) grayscale( 100% ) brightness( 50% )",
          }}
          autoPlay={true}
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
          })}
        />
      </div>
    </Cell>
  );
};
