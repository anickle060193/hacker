import React from "react";
import {
  AnimationClip,
  AnimationMixer,
  BoxGeometry,
  Clock,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  LoopOnce,
  Matrix4,
  PerspectiveCamera,
  Quaternion,
  QuaternionKeyframeTrack,
  Scene,
  Vector3,
  VectorKeyframeTrack,
  WebGLRenderer,
} from "three";

import { Cell, CellProps } from "./Cell";

const BOX_SIZE = 0.2;
const BOX_MIN_HEIGHT = 0.2;
const BOX_MAX_HEIGHT = 2.0;
const BOX_GAP = 0.3;

const BOX_COUNT_XY = 20;

const ROTATE_DURATION = 1;
const MOVE_DURATION = 4;

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

    const disposables: { dispose: () => void }[] = [];

    const documentStyle = window.getComputedStyle(document.documentElement);

    const renderer = new WebGLRenderer({ antialias: true, context: gl });
    renderer.setSize(gl.canvas.width, gl.canvas.height);
    disposables.push(renderer);

    const scene = new Scene();

    const material = new LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
    });
    disposables.push(material);

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
        disposables.push(geometry);
        disposables.push(edges);
      }
    }

    const camera = new PerspectiveCamera(
      75,
      gl.canvas.width / gl.canvas.height,
      0.01,
      2.5
    );
    camera.position.x = BOX_SIZE + BOX_GAP / 2;
    camera.position.y = BOX_SIZE + BOX_GAP / 2;
    camera.position.z = BOX_MIN_HEIGHT * 0.5;

    camera.matrix.lookAt(
      camera.position,
      new Vector3(1, 0, 0).add(camera.position),
      new Vector3(0, 0, 1)
    );
    camera.quaternion.setFromRotationMatrix(camera.matrix);

    const cameraMixer = new AnimationMixer(camera);

    let movingX = true;

    function createMoveAnimation() {
      const currentPosition = camera.position;
      const nextPosition = currentPosition.clone();

      movingX = !movingX;

      const nextCordInt = Math.floor((BOX_COUNT_XY - 1) * Math.random());
      const nextCoord = (BOX_SIZE + BOX_GAP) * (nextCordInt + 1) - BOX_GAP / 2;
      if (movingX) {
        nextPosition.x = nextCoord;
      } else {
        nextPosition.y = nextCoord;
      }

      const currentCameraQuaternion = camera.quaternion;
      const nextCameraMatrix = new Matrix4();
      nextCameraMatrix.lookAt(
        currentPosition,
        nextPosition,
        new Vector3(0, 0, 1)
      );
      const nextCameraQuaternion = new Quaternion().setFromRotationMatrix(
        nextCameraMatrix
      );

      const rotateKeyFrame = new QuaternionKeyframeTrack(
        ".quaternion",
        [0, ROTATE_DURATION],
        [
          ...currentCameraQuaternion.toArray(),
          ...nextCameraQuaternion.toArray(),
        ]
      );

      const moveKeyFrame = new VectorKeyframeTrack(
        ".position",
        [ROTATE_DURATION, ROTATE_DURATION + MOVE_DURATION],
        [...currentPosition.toArray(), ...nextPosition.toArray()]
      );

      const moveClip = new AnimationClip("rotate-and-move", -1, [
        rotateKeyFrame,
        moveKeyFrame,
      ]);

      const moveAction = cameraMixer.clipAction(moveClip);
      moveAction.loop = LoopOnce;
      moveAction.clampWhenFinished = true;

      moveAction.play();

      return moveAction;
    }

    let moveAction = createMoveAnimation();

    const clock = new Clock();

    renderer.setAnimationLoop(() => {
      const color = documentStyle.getPropertyValue("--primary-color");
      material.color = new Color(color);

      cameraMixer.update(clock.getDelta());
      if (!moveAction.isRunning()) {
        const nextMoveAction = createMoveAnimation();
        moveAction.stop();
        cameraMixer.uncacheAction(moveAction.getClip());
        moveAction = nextMoveAction;
      }

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
      disposables.forEach((d) => d.dispose());

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
