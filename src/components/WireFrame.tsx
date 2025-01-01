import React from "react";
import {
  BoxGeometry,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { Cell, CellProps } from "./Cell";

export const WireFrame: React.FC<CellProps> = ({ ...cellProps }) => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!canvas) {
      return;
    }

    const cnv = canvas;
    const context = canvas.getContext("webgl2");
    if (!context) {
      console.warn("Failed to retrieve gl context for canvas");
      return;
    }
    const gl = context;

    const camera = new PerspectiveCamera(
      70,
      gl.canvas.width / gl.canvas.height,
      0.01,
      10
    );
    camera.position.z = 1;

    const scene = new Scene();

    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const edges = new EdgesGeometry(geometry);
    const material = new LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
    });
    const line = new LineSegments(edges, material);

    scene.add(line);

    const renderer = new WebGLRenderer({ antialias: true, context: gl });
    renderer.setSize(gl.canvas.width, gl.canvas.height);

    function onRender(time: DOMHighResTimeStamp) {
      const style = window.getComputedStyle(document.documentElement);
      const value = style.getPropertyValue("--primary-color");

      material.color = new Color(value);

      line.rotation.x = time / 2000;
      line.rotation.y = time / 1000;

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(onRender);

    function onResize() {
      cnv.width = cnv.clientWidth;
      cnv.height = cnv.clientHeight;

      camera.aspect = cnv.width / cnv.height;

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", onResize);

    return () => {
      renderer.setAnimationLoop(null);

      window.removeEventListener("resize", onResize);
    };
  }, [canvas]);

  return (
    <Cell {...cellProps}>
      <canvas
        ref={setCanvas}
        css={{
          width: "100%",
          height: "100%",
        }}
      />
    </Cell>
  );
};
