import React from "react";

import MicrophoneIcon from "../assets/microphone.svg?react";

export const AudioAnalyzer: React.FC = () => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [audioStream, setAudioStream] = React.useState<MediaStream | null>(
    null
  );

  React.useEffect(() => {
    if (!audioStream) {
      return;
    }
    const stream = audioStream;

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

    const observer = new ResizeObserver(onResize);
    observer.observe(ctx.canvas);

    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    analyzer.minDecibels = -90;
    analyzer.maxDecibels = -10;
    analyzer.smoothingTimeConstant = 0.85;
    analyzer.fftSize = 128;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    function onRender() {
      if (stop) {
        return;
      }

      if (!stream.active) {
        setAudioStream(null);
        return;
      }

      analyzer.getFloatFrequencyData(dataArray);

      const width = ctx.canvas.width;
      const height = ctx.canvas.height;

      ctx.clearRect(0, 0, width, height);

      const BAR_GAP = 1;

      const barWidth = (width - BAR_GAP * (bufferLength - 1)) / bufferLength;

      for (let i = 0; i < bufferLength; i++) {
        const x = (barWidth + BAR_GAP) * i;
        const f = (dataArray[i] + 200) / 200;
        const h = f * height;

        ctx.fillStyle = `hsl(from ${style.getPropertyValue(
          "--primary-color"
        )} h s l / ${f.toFixed(2)})`;

        ctx.fillRect(x, height - h, barWidth, h);
      }

      animationFrameRequestId = window.requestAnimationFrame(onRender);
    }

    onRender();

    return () => {
      stop = true;

      if (animationFrameRequestId !== null) {
        window.cancelAnimationFrame(animationFrameRequestId);
      }

      observer.disconnect();

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
  }, [canvas, audioStream]);

  return (
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
        style={{
          cursor: !loading && !audioStream ? "pointer" : undefined,
        }}
        onClick={
          loading || audioStream
            ? undefined
            : async () => {
                setLoading(true);

                try {
                  const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                  });
                  setAudioStream(stream);
                } catch (e) {
                  console.warn("Failed to create audio stream:", e);
                  setAudioStream(null);
                }

                setLoading(false);
              }
        }
      />
      {!audioStream && (
        <MicrophoneIcon
          css={{
            maxHeight: "100%",
            maxWidth: "100%",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate( -50%, -50% )",
            stroke: "var( --primary-color )",
            strokeWidth: 4,
            overflow: "visible",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
