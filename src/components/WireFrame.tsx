import React from "react";
import {
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import { Cell, CellProps } from "./Cell";

const BOX_SIZE = 0.2;
const BOX_MIN_HEIGHT = 0.2;
const BOX_MAX_HEIGHT = 2.0;
const BOX_GAP = 0.3;

const BOX_COUNT_XY = 100;

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

    const documentStyle = window.getComputedStyle(document.documentElement);

    const renderer = new WebGLRenderer({ antialias: true, context: gl });
    renderer.setSize(gl.canvas.width, gl.canvas.height);

    const scene = new Scene();

    const material = new LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
    });

    for (let x = 0; x < BOX_COUNT_XY; x++) {
      for (let y = 0; y < BOX_COUNT_XY; y++) {
        const height =
          (BOX_MAX_HEIGHT - BOX_MIN_HEIGHT) * Math.random() + BOX_MIN_HEIGHT;
        const geometry = new BoxGeometry(BOX_SIZE, BOX_SIZE, height);
        geometry.translate(BOX_SIZE / 2, BOX_SIZE / 2, height / 2);
        const edges = new EdgesGeometry(geometry);
        const box = new LineSegments(edges, material);
        box.position.set(x * (BOX_SIZE + BOX_GAP), y * (BOX_SIZE + BOX_GAP), 0);

        scene.add(box);
      }
    }

    const camera = new PerspectiveCamera(
      75,
      gl.canvas.width / gl.canvas.height,
      0.01,
      2.5
    );

    let lastPosition = new Vector3(
      BOX_SIZE + BOX_GAP / 2,
      BOX_SIZE + BOX_GAP / 2,
      BOX_MIN_HEIGHT * 0.5
    );

    let changeX = false;
    const cameraPoints = Array.from({ length: 100 }, () => {
      const nextXY = Math.floor((BOX_COUNT_XY - 1) * Math.random());
      const nextCoord = (nextXY + 1) * BOX_SIZE + (nextXY + 0.5) * BOX_GAP;
      const nextPosition = new Vector3().copy(lastPosition);

      if (changeX) {
        nextPosition.x = nextCoord;
      } else {
        nextPosition.y = nextCoord;
      }

      changeX = !changeX;
      lastPosition = nextPosition;

      return nextPosition;
    });

    const firstCameraPoint = cameraPoints[0];
    const lastCameraPoint = cameraPoints[cameraPoints.length - 1];
    if (
      firstCameraPoint.x !== lastCameraPoint.x ||
      firstCameraPoint.y !== lastCameraPoint.y
    ) {
      const newLastCameraPoint = new Vector3().copy(lastCameraPoint);
      newLastCameraPoint.x = firstCameraPoint.x;
      cameraPoints.push(newLastCameraPoint);
    }
    cameraPoints.push(firstCameraPoint);

    const cameraSpline = new CatmullRomCurve3(
      cameraPoints,
      true,
      "catmullrom",
      0.01
    );
    const MAX_CAMERA_POSITIONS = 50000;
    let cameraPositionIndex = 0;

    renderer.setAnimationLoop(() => {
      const color = documentStyle.getPropertyValue("--primary-color");
      material.color = new Color(color);

      cameraPositionIndex++;
      if (cameraPositionIndex > MAX_CAMERA_POSITIONS) {
        cameraPositionIndex = 0;
      }

      const cameraPosition = cameraSpline.getPoint(
        cameraPositionIndex / MAX_CAMERA_POSITIONS
      );
      const nextCameraPosition = cameraSpline.getPoint(
        (cameraPositionIndex + 1) / MAX_CAMERA_POSITIONS
      );

      camera.position.copy(cameraPosition);

      camera.matrix.lookAt(
        cameraPosition,
        nextCameraPosition,
        new Vector3(0, 0, 1)
      );
      camera.quaternion.setFromRotationMatrix(camera.matrix);

      renderer.render(scene, camera);
    });

    function onResize() {
      cnv.width = cnv.clientWidth;
      cnv.height = cnv.clientHeight;

      camera.aspect = cnv.width / cnv.height;
      camera.updateProjectionMatrix();

      renderer.setSize(cnv.width, cnv.height);

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();

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
