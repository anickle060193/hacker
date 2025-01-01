import React from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
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

const BOXES_SCENE_SIZE = BOX_COUNT_XY * BOX_SIZE + (BOX_COUNT_XY - 1) * BOX_GAP;

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

    scene.add(
      new Mesh(
        new PlaneGeometry(100, 100),
        new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide })
      )
    );

    const material = new LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
    });

    for (let x = 0; x < BOX_COUNT_XY; x++) {
      for (let y = 0; y < BOX_COUNT_XY; y++) {
        const geometry = new BoxGeometry(
          BOX_SIZE,
          BOX_SIZE,
          (BOX_MAX_HEIGHT - BOX_MIN_HEIGHT) * Math.random() + BOX_MIN_HEIGHT
        );
        const edges = new EdgesGeometry(geometry);
        const box = new LineSegments(edges, material);
        box.position.set(x * (BOX_SIZE + BOX_GAP), y * (BOX_SIZE + BOX_GAP), 0);

        scene.add(box);
      }
    }

    const camera = new PerspectiveCamera(
      75,
      gl.canvas.width / gl.canvas.height,
      0.1,
      1000.0
    );
    camera.position.x = BOXES_SCENE_SIZE / 2;
    camera.position.y = BOXES_SCENE_SIZE / 2;
    camera.position.z = 30;

    let lastPosition = new Vector3(
      BOX_SIZE + BOX_GAP / 2,
      BOX_SIZE + BOX_GAP / 2,
      BOX_MIN_HEIGHT * 0.25
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
      0.1
    );
    const MAX_CAMERA_POSITIONS = 20000;
    let cameraPositionIndex = 0;

    // scene.add(
    //   new LineSegments(
    //     new BufferGeometry().setFromPoints(
    //       cameraSpline.getSpacedPoints(MAX_CAMERA_POSITIONS)
    //     ),
    //     new LineBasicMaterial({
    //       color: "white",
    //       linewidth: 1,
    //     })
    //   )
    // );

    function onRender(time: DOMHighResTimeStamp) {
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

      camera.position.x = cameraPosition.x;
      camera.position.y = cameraPosition.y;
      camera.position.z = cameraPosition.z;

      camera.lookAt(nextCameraPosition);
      camera.rotation.z = 0;

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
