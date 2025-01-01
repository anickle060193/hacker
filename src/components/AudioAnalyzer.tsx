import React from "react";

import { Cell, CellProps } from "./Cell";

import MicrophoneIcon from "../assets/microphone.svg?react";

export const AudioAnalyzer: React.FC<CellProps> = ({ ...cellProps }) => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const [listen, setListen] = React.useState(false);

  React.useEffect(() => {
    if (!listen) {
      return;
    }

    const context = canvas?.getContext("2d");
    if (!context) {
      return;
    }
    const ctx = context;

    const style = window.getComputedStyle(document.documentElement);

    let stop = false;
    let animationFrameRequestId: number | null = null;

    function onResize() {
      ctx.canvas.width = ctx.canvas.clientWidth;
      ctx.canvas.height = ctx.canvas.clientHeight;
    }

    window.addEventListener("resize", onResize);

    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });

        const audioContext = new AudioContext();
        const analyzer = audioContext.createAnalyser();
        // analyzer.minDecibels = -90;
        // analyzer.maxDecibels = -10;
        // analyzer.smoothingTimeConstant = 0.85;
        analyzer.fftSize = 128;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function onRender() {
          if (stop) {
            return;
          }

          analyzer.getByteFrequencyData(dataArray);

          const width = ctx.canvas.width;
          const height = ctx.canvas.height;

          ctx.clearRect(0, 0, width, height);

          ctx.fillStyle = style.getPropertyValue("--primary-color");

          const BAR_GAP = 1;

          const barWidth =
            (width - BAR_GAP * (bufferLength - 1)) / bufferLength;

          for (let i = 0; i < bufferLength; i++) {
            const x = (barWidth + BAR_GAP) * i;
            const h = (dataArray[i] / 255) * height;
            ctx.fillRect(x, height - h, barWidth, h);
          }

          animationFrameRequestId = window.requestAnimationFrame(onRender);
        }

        onRender();
      } catch (e) {
        console.warn("Failed to create audio analyzer:", e);
        setListen(false);
      }
    })();

    return () => {
      stop = true;

      if (animationFrameRequestId !== null) {
        window.cancelAnimationFrame(animationFrameRequestId);
      }

      window.removeEventListener("resize", onResize);
    };
  }, [canvas, listen]);

  return (
    <Cell {...cellProps}>
      <div
        css={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <canvas
          ref={setCanvas}
          css={{
            width: "100%",
            height: "100%",
          }}
        />
        {!listen && (
          <MicrophoneIcon
            css={(theme) => ({
              maxHeight: "100%",
              maxWidth: "100%",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate( -50%, -50% )",
              fill: theme.colors.primary,
            })}
            onClick={() => setListen(true)}
          />
        )}
      </div>
    </Cell>
  );
};
